import * as SQLite from 'expo-sqlite';
import type { Transaction, Budget, AppSettings, CurrencyCode } from '../types';

// ─── Singleton ────────────────────────────────────────────────────────────────
// Cache the *promise*, not the resolved value.
// Caching only the resolved value still lets two callers race through the
// `if (_db)` check before the first openDatabaseAsync resolves, producing
// two native connections — one of which Android gives a null internal handle.

let _dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDB = (): Promise<SQLite.SQLiteDatabase> => {
  if (!_dbPromise) {
    _dbPromise = SQLite.openDatabaseAsync('sovereignledger.db');
  }
  return _dbPromise;
};

export const initDB = async (): Promise<void> => {
  const db = await getDB();

  // execAsync with multiple statements is unreliable on Android.
  // Run each DDL statement individually.
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      isRecurring INTEGER NOT NULL DEFAULT 0,
      recurringFrequency TEXT,
      recurringEndDate TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      \`limit\` REAL NOT NULL,
      period TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed default settings
  await db.runAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['currency', 'USD']);
  await db.runAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['isVerified', 'false']);
  await db.runAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['isAuthenticated', 'false']);
  await db.runAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['currentUserId', '']);
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const insertTransaction = async (tx: Transaction): Promise<void> => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO transactions
      (id, type, amount, category, description, date, isRecurring, recurringFrequency, recurringEndDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tx.id, tx.type, tx.amount, tx.category, tx.description,
      tx.date, tx.isRecurring ? 1 : 0,
      tx.recurringFrequency ?? null,
      tx.recurringEndDate ?? null,
      tx.createdAt,
    ]
  );
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(`SELECT * FROM transactions ORDER BY date DESC`);
  return rows.map(rowToTransaction);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
};

export const updateTransaction = async (tx: Transaction): Promise<void> => {
  const db = await getDB();
  await db.runAsync(
    `UPDATE transactions SET
      type=?, amount=?, category=?, description=?, date=?,
      isRecurring=?, recurringFrequency=?, recurringEndDate=?
     WHERE id=?`,
    [
      tx.type, tx.amount, tx.category, tx.description, tx.date,
      tx.isRecurring ? 1 : 0,
      tx.recurringFrequency ?? null,
      tx.recurringEndDate ?? null,
      tx.id,
    ]
  );
};

const rowToTransaction = (row: any): Transaction => ({
  id:                 row.id,
  type:               row.type,
  amount:             row.amount,
  category:           row.category,
  description:        row.description,
  date:               row.date,
  isRecurring:        row.isRecurring === 1,
  recurringFrequency: row.recurringFrequency ?? undefined,
  recurringEndDate:   row.recurringEndDate ?? undefined,
  createdAt:          row.createdAt,
});

// ─── Budgets ──────────────────────────────────────────────────────────────────

export const insertBudget = async (budget: Budget): Promise<void> => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO budgets (id, category, \`limit\`, period, startDate, endDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [budget.id, budget.category, budget.limit, budget.period, budget.startDate, budget.endDate, budget.createdAt]
  );
};

export const getAllBudgets = async (): Promise<Budget[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(`SELECT * FROM budgets ORDER BY createdAt DESC`);
  return rows.map((r: any): Budget => ({
    id:        r.id,
    category:  r.category,
    limit:     r.limit,
    period:    r.period,
    startDate: r.startDate,
    endDate:   r.endDate,
    createdAt: r.createdAt,
  }));
};

export const deleteBudget = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM budgets WHERE id = ?`, [id]);
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getSetting = async (key: string): Promise<string | null> => {
  const db = await getDB();
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = ?`, [key]
  );
  return row?.value ?? null;
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  const db = await getDB();
  await db.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value]
  );
};

// Writes multiple settings in one transaction — use this for logout so Android
// only opens a single prepared statement sequence instead of three.
export const setSettings = async (entries: Record<string, string>): Promise<void> => {
  const db = await getDB();
  await db.withTransactionAsync(async () => {
    for (const [key, value] of Object.entries(entries)) {
      await db.runAsync(
        `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value]
      );
    }
  });
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const insertUser = async (user: any): Promise<void> => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)`,
    [user.id, user.name, user.email, user.password, user.createdAt]
  );
};

export const getUser = async (email: string): Promise<any | null> => {
  const db = await getDB();
  return await db.getFirstAsync<any>(`SELECT * FROM users WHERE email = ?`, [email]);
};

export const getAppSettings = async (): Promise<AppSettings> => {
  const currency = (await getSetting('currency') ?? 'USD') as CurrencyCode;
  const isVerified = (await getSetting('isVerified')) === 'true';
  const verificationExpiry = (await getSetting('verificationExpiry')) ?? undefined;
  const isAuthenticated = (await getSetting('isAuthenticated')) === 'true';
  const currentUserId = (await getSetting('currentUserId')) ?? undefined;

  return { currency, isVerified, verificationExpiry, isAuthenticated, currentUserId };
};