import type { CategoryMeta, CurrencyCode, CurrencyInfo, TransactionCategory } from '../types';

export const CATEGORY_META: Record<TransactionCategory, CategoryMeta> = {
  food:          { label: 'Food & Dining',   color: '#FF6B6B', icon: 'utensils' },
  transport:     { label: 'Transport',        color: '#4ECDC4', icon: 'car' },
  salary:        { label: 'Salary',           color: '#45B7D1', icon: 'briefcase' },
  shopping:      { label: 'Shopping',         color: '#96CEB4', icon: 'shopping-bag' },
  entertainment: { label: 'Entertainment',    color: '#FFEAA7', icon: 'film' },
  health:        { label: 'Health',           color: '#DDA0DD', icon: 'heart' },
  utilities:     { label: 'Utilities',        color: '#98D8C8', icon: 'zap' },
  rent:          { label: 'Rent',             color: '#F7DC6F', icon: 'home' },
  savings:       { label: 'Savings',          color: '#82E0AA', icon: 'piggy-bank' },
  investment:    { label: 'Investment',       color: '#76D7C4', icon: 'trending-up' },
  crypto:        { label: 'Crypto',           color: '#F0B27A', icon: 'bitcoin' },
  other:         { label: 'Other',            color: '#AEB6BF', icon: 'more-horizontal' },
};

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$',  name: 'US Dollar',        locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€',  name: 'Euro',             locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£',  name: 'British Pound',    locale: 'en-GB' },
  NGN: { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira',   locale: 'en-NG' },
  JPY: { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',     locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',  locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',locale: 'en-AU' },
  GHS: { code: 'GHS', symbol: 'GH₵',name: 'Ghanaian Cedi',   locale: 'en-GH' },
  KES: { code: 'KES', symbol: 'KSh',name: 'Kenyan Shilling',  locale: 'sw-KE' },
  ZAR: { code: 'ZAR', symbol: 'R',  name: 'South African Rand',locale: 'en-ZA' },
};

export const COLORS = {
  // Core brand
  primary:        '#1A6BFF',
  primaryDark:    '#0D4FCC',
  primaryLight:   '#4D8BFF',
  accent:         '#00D4AA',
  accentDark:     '#00A884',

  // Background layers (dark theme)
  bg0:            '#0A0E1A',
  bg1:            '#0F1422',
  bg2:            '#141928',
  bg3:            '#1C2235',
  card:           '#1C2235',
  cardBorder:     '#252D42',

  // Text
  textPrimary:    '#FFFFFF',
  textSecondary:  '#8892AA',
  textMuted:      '#4A5568',

  // Status
  income:         '#00D4AA',
  expense:        '#FF4757',
  warning:        '#FFA502',

  // Chart colors
  chart1:         '#1A6BFF',
  chart2:         '#00D4AA',
  chart3:         '#FF4757',
  chart4:         '#FFA502',
  chart5:         '#A855F7',
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
};