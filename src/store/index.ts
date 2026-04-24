import { create } from 'zustand';
import type { Transaction, Budget, AppSettings, CurrencyCode } from '../types';
import {
  initDB, getAllTransactions, insertTransaction as dbInsert,
  deleteTransaction as dbDelete, updateTransaction as dbUpdate,
  getAllBudgets, insertBudget as dbInsertBudget, deleteBudget as dbDeleteBudget,
  getAppSettings, setSetting,
} from '../db';
import { generateId, getNextRecurringDate } from '../utils';

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
    
    // Initial fetch
    let transactions = await getAllTransactions();
    let budgets = await getAllBudgets();
    let settings = await getAppSettings();

    // Process recurring transactions
    const now = new Date();
    let updated = false;
    
    for (const tx of transactions) {
      if (tx.isRecurring && tx.recurringFrequency) {
        let lastDate = new Date(tx.date);
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
          
          // Update the "source" transaction's date to avoid double processing next time
          // (Actually, we should update the original tx in DB or just keep adding new ones)
          // Better: The source transaction should be updated to the latest date.
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
      transactions: transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
      budgets, 
      settings, 
      isLoading: false, 
      isInitialized: true 
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