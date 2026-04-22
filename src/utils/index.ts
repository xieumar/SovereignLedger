import { CURRENCIES } from '../constants';
import type { CurrencyCode, Transaction, TransactionCategory } from '../types';

// ─── ID Generation ─────────────────────────────────────────────────────────────
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Currency Formatting ───────────────────────────────────────────────────────
export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode = 'USD'
): string => {
  const info = CURRENCIES[currencyCode];
  try {
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${info.symbol}${amount.toFixed(2)}`;
  }
};

export const formatCompact = (
  amount: number,
  currencyCode: CurrencyCode = 'USD'
): string => {
  const info = CURRENCIES[currencyCode];
  if (Math.abs(amount) >= 1_000_000)
    return `${info.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000)
    return `${info.symbol}${(amount / 1_000).toFixed(1)}K`;
  return `${info.symbol}${amount.toFixed(2)}`;
};

// ─── Date Helpers ──────────────────────────────────────────────────────────────
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDateShort = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const startOfMonth = (date = new Date()): string => {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
};

export const endOfMonth = (date = new Date()): string => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();
};

export const startOfWeek = (date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export const last7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
};

export const last6MonthLabels = (): string[] => {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleDateString('en-US', { month: 'short' });
  });
};

// ─── Transaction Aggregates ────────────────────────────────────────────────────
export const calcBalance = (transactions: Transaction[]): number =>
  transactions.reduce((sum, t) =>
    t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

export const calcTotalIncome = (transactions: Transaction[]): number =>
  transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

export const calcTotalExpenses = (transactions: Transaction[]): number =>
  transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

export const spendingByCategory = (
  transactions: Transaction[]
): Record<TransactionCategory, number> => {
  const result = {} as Record<TransactionCategory, number>;
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      result[t.category] = (result[t.category] ?? 0) + t.amount;
    });
  return result;
};

export const spendingLast6Months = (transactions: Transaction[]): number[] => {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(monthStr))
      .reduce((s, t) => s + t.amount, 0);
  });
};

export const incomeLast6Months = (transactions: Transaction[]): number[] => {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return transactions
      .filter(t => t.type === 'income' && t.date.startsWith(monthStr))
      .reduce((s, t) => s + t.amount, 0);
  });
};

// ─── CSV Export ────────────────────────────────────────────────────────────────
export const transactionsToCSV = (transactions: Transaction[]): string => {
  const header = 'ID,Type,Amount,Category,Description,Date,IsRecurring,RecurringFrequency\n';
  const rows = transactions.map(t =>
    [
      t.id, t.type, t.amount, t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.date, t.isRecurring, t.recurringFrequency ?? '',
    ].join(',')
  );
  return header + rows.join('\n');
};

// ─── Recurring ─────────────────────────────────────────────────────────────────
export const getNextRecurringDate = (date: string, frequency: string): string => {
  const d = new Date(date);
  switch (frequency) {
    case 'daily':   d.setDate(d.getDate() + 1); break;
    case 'weekly':  d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'yearly':  d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString();
};