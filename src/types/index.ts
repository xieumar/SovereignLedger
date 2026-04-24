export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'salary'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'utilities'
  | 'rent'
  | 'savings'
  | 'investment'
  | 'crypto'
  | 'groceries'
  | 'other';

export type TransactionType = 'income' | 'expense';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // ISO string
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  name?: string;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CategoryMeta {
  label: string;
  color: string;
  icon: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'JPY' | 'CAD' | 'AUD' | 'GHS' | 'KES' | 'ZAR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AppSettings {
  currency: CurrencyCode;
  isVerified: boolean;
  verificationExpiry?: string;
  isAuthenticated?: boolean;
  currentUserId?: string;
}

export interface SpendingPoint {
  label: string;
  value: number;
}