import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  Utensils, Car, Briefcase, ShoppingBag, Film, Heart,
  Zap, Home, PiggyBank, TrendingUp, Bitcoin, MoreHorizontal,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, CATEGORY_META } from '@/constants';
import { formatCurrency } from '@/utils';
import type { TransactionCategory, CurrencyCode } from '@/types';

const ICON_MAP: Record<string, any> = {
  utensils: Utensils, car: Car, briefcase: Briefcase,
  'shopping-bag': ShoppingBag, film: Film, heart: Heart,
  zap: Zap, home: Home, 'piggy-bank': PiggyBank,
  'trending-up': TrendingUp, bitcoin: Bitcoin,
  'more-horizontal': MoreHorizontal,
};

interface Allocation {
  category: TransactionCategory;
  amount: number;
  change?: number; // percentage
}

interface Props {
  allocations: Allocation[];
  currency: CurrencyCode;
}

export const AllocationRow = ({ allocations, currency }: Props) => {
  if (allocations.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {allocations.map((a, i) => {
        const meta = CATEGORY_META[a.category];
        const IconComp = ICON_MAP[meta.icon] ?? MoreHorizontal;
        const isPositive = (a.change ?? 0) >= 0;

        return (
          <View key={i} style={styles.tile}>
            <View style={[styles.iconWrap, { backgroundColor: meta.color + '20' }]}>
              <IconComp size={16} color={meta.color} />
            </View>
            <Text style={styles.categoryLabel} numberOfLines={1}>{meta.label}</Text>
            <Text style={styles.amount}>{formatCurrency(a.amount, currency)}</Text>
            {a.change !== undefined && (
              <View style={[styles.changePill, { backgroundColor: (isPositive ? COLORS.expense : COLORS.income) + '22' }]}>
                <Text style={[styles.changeText, { color: isPositive ? COLORS.expense : COLORS.income }]}>
                  {isPositive ? '+' : ''}{a.change.toFixed(0)}%
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -SPACING.md },
  tile: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 4,
    marginLeft: SPACING.md,
    minWidth: 100,
    maxWidth: 110,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  amount: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  changePill: {
    marginTop: 4,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  changeText: { fontSize: 10, fontWeight: '700' },
});