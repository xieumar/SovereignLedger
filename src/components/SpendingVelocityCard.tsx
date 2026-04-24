import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingDown, TrendingUp, PieChart } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card } from './ui';

interface SpendingVelocityCardProps {
  remaining: number;
  velocity: number; // percent relative to baseline
  data: number[]; // daily spending for the week
}

export const SpendingVelocityCard = ({ remaining, velocity, data }: SpendingVelocityCardProps) => {
  const maxVal = Math.max(...data, 1);
  const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Spending Velocity</Text>
          <Text style={styles.sub}>Trend relative to baseline</Text>
        </View>
        <View style={styles.badge}>
          {velocity >= 0 ? (
            <TrendingUp size={12} color={COLORS.expense} />
          ) : (
            <TrendingDown size={12} color={COLORS.income} />
          )}
          <Text style={[styles.badgeText, { color: velocity >= 0 ? COLORS.expense : COLORS.income }]}>
            {Math.abs(velocity)}%
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {data.map((val, i) => (
          <View key={i} style={styles.barWrap}>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { height: `${(val / maxVal) * 100}%` }]} />
            </View>
            <Text style={styles.barLabel}>{labels[i]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <PieChart size={18} color="#0047AB" />
          <Text style={styles.footerTitle}>Budget Remaining</Text>
        </View>
        <Text style={styles.footerAmt}>${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: SPACING.xl,
    paddingHorizontal: 4,
  },
  barWrap: {
    alignItems: 'center',
    width: '12%',
  },
  barTrack: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: '#8EAFD6', // Muted blue from image
    borderRadius: RADIUS.sm,
  },
  barLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  footerAmt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B', // Dark green from image
  },
});
