import * as SQLite from 'expo-sqlite';
import type { Transaction, Budget, AppSettings, CurrencyCode } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('sovereignledger.db');
  }
  return db;
};

export const initDB = async (): Promise<void> => {
  const database = await getDB();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

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

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      \`limit\` REAL NOT NULL,
      period TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default settings
  await database.runAsync(
    `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
    ['currency', 'USD']
  );
  await database.runAsync(
    `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
    ['isVerified', 'false']
  );
};


export const insertTransaction = async (tx: Transaction): Promise<void> => {
  const database = await getDB();
  await database.runAsync(
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
  const database = await getDB();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM transactions ORDER BY date DESC`
  );
  return rows.map(rowToTransaction);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const database = await getDB();
  await database.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
};

export const updateTransaction = async (tx: Transaction): Promise<void> => {
  const database = await getDB();
  await database.runAsync(
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
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO budgets (id, category, \`limit\`, period, startDate, endDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [budget.id, budget.category, budget.limit, budget.period, budget.startDate, budget.endDate, budget.createdAt]
  );
};

export const getAllBudgets = async (): Promise<Budget[]> => {
  const database = await getDB();
  const rows = await database.getAllAsync<any>(`SELECT * FROM budgets ORDER BY createdAt DESC`);
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
  const database = await getDB();
  await database.runAsync(`DELETE FROM budgets WHERE id = ?`, [id]);
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getSetting = async (key: string): Promise<string | null> => {
  const database = await getDB();
  const row = await database.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = ?`, [key]
  );
  return row?.value ?? null;
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value]
  );
};

export const getAppSettings = async (): Promise<AppSettings> => {
  const currency = (await getSetting('currency') ?? 'USD') as CurrencyCode;
  const isVerified = (await getSetting('isVerified')) === 'true';
  const verificationExpiry = (await getSetting('verificationExpiry')) ?? undefined;
  return { currency, isVerified, verificationExpiry };
};