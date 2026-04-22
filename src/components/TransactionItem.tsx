import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  Utensils, Car, Briefcase, ShoppingBag, Film, Heart,
  Zap, Home, PiggyBank, TrendingUp, Bitcoin, MoreHorizontal,
  RefreshCw, Trash2,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, CATEGORY_META } from '@/constants';
import { formatCurrency, formatDateShort } from '@/utils';
import type { Transaction, CurrencyCode } from '@/types';

const ICON_MAP: Record<string, any> = {
  utensils: Utensils, car: Car, briefcase: Briefcase,
  'shopping-bag': ShoppingBag, film: Film, heart: Heart,
  zap: Zap, home: Home, 'piggy-bank': PiggyBank,
  'trending-up': TrendingUp, bitcoin: Bitcoin,
  'more-horizontal': MoreHorizontal,
};

interface Props {
  transaction: Transaction;
  currency: CurrencyCode;
  onDelete?: (id: string) => void;
  onEdit?: (t: Transaction) => void;
}

export const TransactionItem = ({ transaction: t, currency, onDelete, onEdit }: Props) => {
  const meta = CATEGORY_META[t.category];
  const IconComp = ICON_MAP[meta.icon] ?? MoreHorizontal;
  const isExpense = t.type === 'expense';

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(t.id) },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onEdit?.(t)}
      onLongPress={handleDelete}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: meta.color + '22' }]}>
        <IconComp size={18} color={meta.color} />
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.description} numberOfLines={1}>{t.description}</Text>
          {t.isRecurring && <RefreshCw size={12} color={COLORS.textMuted} style={{ marginLeft: 4 }} />}
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.category}>{meta.label}</Text>
          <Text style={styles.date}>{formatDateShort(t.date)}</Text>
        </View>
      </View>

      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: isExpense ? COLORS.expense : COLORS.income }]}>
          {isExpense ? '-' : '+'}{formatCurrency(t.amount, currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  info: { flex: 1, marginRight: SPACING.sm },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  description: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', flex: 1 },
  category: { color: COLORS.textMuted, fontSize: 12, marginRight: SPACING.sm },
  date: { color: COLORS.textMuted, fontSize: 12 },
  amountCol: { alignItems: 'flex-end' },
  amount: { fontSize: 14, fontWeight: '700' },
});