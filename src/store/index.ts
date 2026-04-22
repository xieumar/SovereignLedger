import { create } from 'zustand';
import type { Transaction, Budget, AppSettings, CurrencyCode } from '../types';
import {
  initDB, getAllTransactions, insertTransaction as dbInsert,
  deleteTransaction as dbDelete, updateTransaction as dbUpdate,
  getAllBudgets, insertBudget as dbInsertBudget, deleteBudget as dbDeleteBudget,
  getAppSettings, setSetting,
} from '../db';
import { generateId } from '../utils';

interface FinanceState {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  settings: AppSettings;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  editTransaction: (tx: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  setVerified: (verified: boolean, expiry?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  budgets: [],
  settings: { currency: 'USD', isVerified: false },
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    await initDB();
    const [transactions, budgets, settings] = await Promise.all([
      getAllTransactions(),
      getAllBudgets(),
      getAppSettings(),
    ]);
    set({ transactions, budgets, settings, isLoading: false, isInitialized: true });
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
    const newTx: Transaction = {
      ...tx,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    await dbInsert(newTx);
    set(s => ({ transactions: [newTx, ...s.transactions] }));
  },

  editTransaction: async (tx) => {
    await dbUpdate(tx);
    set(s => ({
      transactions: s.transactions.map(t => t.id === tx.id ? tx : t),
    }));
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
    set(s => ({
      settings: { ...s.settings, isVerified: verified, verificationExpiry: expiry },
    }));
  },
}));