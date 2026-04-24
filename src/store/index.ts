import { create } from 'zustand';
import type { Transaction, Budget, AppSettings, CurrencyCode } from '../types';
import {
  initDB, getAllTransactions, insertTransaction as dbInsert,
  deleteTransaction as dbDelete, updateTransaction as dbUpdate,
  getAllBudgets, insertBudget as dbInsertBudget, deleteBudget as dbDeleteBudget,
  getAppSettings, getSetting, setSetting, setSettings, insertUser, getUser,
} from '../db';
import { generateId, getNextRecurringDate } from '../utils';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  settings: AppSettings;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  editTransaction: (tx: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  setVerified: (verified: boolean, expiry?: string) => Promise<void>;
  refresh: () => Promise<void>;

  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  isVerified: false,
  isAuthenticated: false,
  currentUserId: '',
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  budgets: [],
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    await initDB();

    let transactions = await getAllTransactions();
    let budgets = await getAllBudgets();
    let settings = await getAppSettings();

    const now = new Date();
    let updated = false;

    for (const tx of transactions) {
      if (tx.isRecurring && tx.recurringFrequency) {
        let nextDate = new Date(getNextRecurringDate(tx.date, tx.recurringFrequency));

        while (nextDate <= now && (!tx.recurringEndDate || nextDate <= new Date(tx.recurringEndDate))) {
          const newTx: Transaction = {
            ...tx,
            id: generateId(),
            date: nextDate.toISOString(),
            createdAt: new Date().toISOString(),
          };
          await dbInsert(newTx);
          transactions.push(newTx);

          tx.date = nextDate.toISOString();
          await dbUpdate(tx);

          nextDate = new Date(getNextRecurringDate(tx.date, tx.recurringFrequency));
          updated = true;
        }
      }
    }

    if (updated) {
      transactions = await getAllTransactions();
    }

    set({
      transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      budgets,
      settings,
      isLoading: false,
      isInitialized: true,
    });
  },

  refresh: async () => {
    const [transactions, budgets, settings] = await Promise.all([
      getAllTransactions(),
      getAllBudgets(),
      getAppSettings(),
    ]);
    set({ transactions, budgets, settings });
  },

  addTransaction: async (tx) => {
    const newTx: Transaction = { ...tx, id: generateId(), createdAt: new Date().toISOString() };
    await dbInsert(newTx);
    set(s => ({ transactions: [newTx, ...s.transactions] }));
  },

  editTransaction: async (tx) => {
    await dbUpdate(tx);
    set(s => ({ transactions: s.transactions.map(t => t.id === tx.id ? tx : t) }));
  },

  removeTransaction: async (id) => {
    await dbDelete(id);
    set(s => ({ transactions: s.transactions.filter(t => t.id !== id) }));
  },

  addBudget: async (b) => {
    const newB: Budget = { ...b, id: generateId(), createdAt: new Date().toISOString() };
    await dbInsertBudget(newB);
    set(s => ({ budgets: [newB, ...s.budgets] }));
  },

  removeBudget: async (id) => {
    await dbDeleteBudget(id);
    set(s => ({ budgets: s.budgets.filter(b => b.id !== id) }));
  },

  setCurrency: async (code) => {
    await setSetting('currency', code);
    set(s => ({ settings: { ...s.settings, currency: code } }));
  },

  setVerified: async (verified, expiry) => {
    await setSetting('isVerified', verified ? 'true' : 'false');
    if (expiry) await setSetting('verificationExpiry', expiry);
    set(s => ({ settings: { ...s.settings, isVerified: verified, verificationExpiry: expiry } }));
  },

  login: async (email, pass) => {
    const user = await getUser(email);
    if (user && user.password === pass) {
      await setSettings({ isAuthenticated: 'true', currentUserId: user.id });
      set(s => ({ settings: { ...s.settings, isAuthenticated: true, currentUserId: user.id } }));
      return true;
    }
    return false;
  },

  signup: async (name, email, pass) => {
    const existing = await getUser(email);
    if (existing) return false;

    const newUser = {
      id: generateId(),
      name,
      email,
      password: pass,
      createdAt: new Date().toISOString(),
    };
    await insertUser(newUser);
    await setSettings({ isAuthenticated: 'true', currentUserId: newUser.id });
    set(s => ({ settings: { ...s.settings, isAuthenticated: true, currentUserId: newUser.id } }));
    return true;
  },

  logout: async () => {
    // Single transaction — one native prepareAsync sequence instead of three.
    await setSettings({
      isAuthenticated: 'false',
      currentUserId: '',
      isVerified: 'false',
    });

    // Reset store fully so initialize() runs fresh on next login.
    set({
      transactions: [],
      budgets: [],
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      isInitialized: false,
    });
  },
}));