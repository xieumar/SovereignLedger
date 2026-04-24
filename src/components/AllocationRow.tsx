import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Car, Utensils, ShoppingCart, Zap, Film, Heart, Briefcase, ShoppingBag, Home, PiggyBank, TrendingUp, Bitcoin, MoreHorizontal } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';
import { spendingByCategory } from '@/utils';

const ICON_MAP: any = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingCart,
  utilities: Zap,
  entertainment: Film,
  health: Heart,
  salary: Briefcase,
  rent: Home,
  savings: PiggyBank,
  investment: TrendingUp,
  crypto: Bitcoin,
  other: MoreHorizontal,
};

const LABEL_MAP: any = {
  food: 'Dining Out',
  transport: 'Transport',
  groceries: 'Groceries',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  other: 'Transportation', // Mapping 'other' to match the 6th card in image
};

export const AllocationRow = () => {
  const { budgets, transactions } = useFinanceStore();
  const spendingMap = spendingByCategory(transactions);

  // If no budgets, show nothing or empty state
  if (budgets.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
      {budgets.map((b) => {
        const spent = spendingMap[b.category] || 0;
        const left = Math.max(0, b.limit - spent);
        const progress = Math.min(1, spent / b.limit);
        const Icon = ICON_MAP[b.category] || MoreHorizontal;
        const label = LABEL_MAP[b.category] || (b.category.charAt(0).toUpperCase() + b.category.slice(1).replace('-', ' '));
            
        const barColor = progress > 0.8 ? COLORS.expense : COLORS.primary;

        return (
          <View key={b.id} style={styles.tile}>
            <View style={styles.iconWrap}>
              <Icon size={14} color={COLORS.primaryDark} />
            </View>
            <Text style={styles.categoryLabel}>{label}</Text>
            <Text style={styles.amount}>${spent.toLocaleString()}</Text>
            
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={[styles.leftText, { color: barColor }]}>${left.toLocaleString()} LEFT</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -SPACING.md },
  content: { paddingHorizontal: SPACING.md, gap: SPACING.md, paddingVertical: 10 },
  tile: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    color: COLORS.primaryDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: RADIUS.full,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  leftText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});