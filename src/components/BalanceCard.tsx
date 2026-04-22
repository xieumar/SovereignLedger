import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { formatCurrency } from '@/utils';
import type { CurrencyCode } from '@/types';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  currency: CurrencyCode;
  onDeposit: () => void;
  onWithdraw: () => void;
  style?: ViewStyle;
}

export const BalanceCard = ({
  balance, income, expenses, currency, onDeposit, onWithdraw, style,
}: BalanceCardProps) => {
  const isPositive = balance >= 0;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.portfolioLabel}>LIQUID WEALTH PORTFOLIO</Text>

      {/* Change indicator */}
      <View style={styles.changePill}>
        <Text style={styles.changeText}>+12.5%</Text>
      </View>

      <Text style={styles.balanceAmount}>
        {formatCurrency(Math.abs(balance), currency)}
      </Text>
      <Text style={styles.balanceSubLabel}>
        Market valuation as of today
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onDeposit} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>DEPOSIT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={onWithdraw} activeOpacity={0.8}>
          <Text style={[styles.actionBtnText, styles.actionBtnTextOutline]}>WITHDRAW</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>INCOME</Text>
          <Text style={[styles.statValue, { color: COLORS.income }]}>
            +{formatCurrency(income, currency)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>EXPENSES</Text>
          <Text style={[styles.statValue, { color: COLORS.expense }]}>
            -{formatCurrency(expenses, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  portfolioLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  changePill: {
    position: 'absolute', top: SPACING.lg, right: SPACING.lg,
    backgroundColor: '#00E676',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  changeText: { color: '#004D40', fontSize: 12, fontWeight: '800' },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  balanceSubLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnOutline: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.8 },
  actionBtnTextOutline: { color: 'rgba(255,255,255,0.9)' },
  statsRow: {
    display: 'none', // Removed stats row based on the mockup
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  statValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
});