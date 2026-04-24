import React from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, User, MoreHorizontal, ShoppingBag, Banknote, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Card, SectionHeader} from '@/components/ui';
import { BalanceCard } from '@/components/BalanceCard';
import { AllocationRow } from '@/components/AllocationRow';
import { SplineChart } from '@/components/SplineChart';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { COLORS, SPACING, RADIUS } from '@/constants';

import { useFinanceStore } from '@/store';
import { calcBalance, calcTotalIncome, calcTotalExpenses, last6MonthLabels, spendingLast6Months } from '@/utils';

export default function OverviewScreen() {
  const router = useRouter();
  const { transactions, settings, refresh, isLoading } = useFinanceStore();

  const balance = calcBalance(transactions);
  const totalIncome = calcTotalIncome(transactions);
  const totalExpenses = calcTotalExpenses(transactions);

  const spendData = spendingLast6Months(transactions);
  const monthLabels = last6MonthLabels();

  const savings = [
    { label: 'INVESTMENTS', percent: 65, color: COLORS.primary },
    { label: 'CASH SAVINGS', percent: 25, color: COLORS.primaryLight },
    { label: 'CRYPTO VAULT', percent: 10, color: COLORS.accent },
  ];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <User size={18} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.appName}>Sovereign Ledger</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications' as any)}>
            <Bell size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          income={totalIncome}
          expenses={totalExpenses}
          currency={settings.currency}
          onDeposit={() => router.push('/add-transaction' as any)}
          onWithdraw={() => router.push('/add-transaction' as any)}
          style={styles.balanceCard}
        />

        {/* Allocations */}
        <View style={styles.section}>
          <SectionHeader
            title="Allocations"
            actionLabel="View All"
            onAction={() => router.push('/(tabs)/allocations')}
          />
          <AllocationRow />
        </View>

        {/* Spending Trend */}
        <Card style={styles.section}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.trendTitle}>Spending Trend</Text>
              <Text style={styles.trendSub}>DAILY ACTIVITY</Text>
            </View>
            <MoreHorizontal size={20} color={COLORS.primary} />
          </View>
          <SplineChart
            data={spendData}
            labels={monthLabels}
            color={COLORS.primary}
          />
        </Card>

        {/* Savings */}
        <Card style={[styles.section, styles.savingsCard]}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsTitle}>Savings Goals</Text>
            <Settings size={16} color={COLORS.primary} />
          </View>
          {savings.map((s, i) => (
            <View key={i} style={styles.savingRow}>
              <View style={styles.savingRowHeader}>
                <Text style={styles.savingLabel}>{s.label}</Text>
                <Text style={styles.savingLabel}>{s.percent}%</Text>
              </View>
              <View style={styles.savingTrack}>
                <View style={[styles.savingFill, { width: `${s.percent}%`, backgroundColor: s.color }]} />
              </View>
            </View>
          ))}
        </Card>

        {/* Recent Ledger */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent Ledger"
            actionLabel="VIEW ALL"
            onAction={() => router.push('/transactions' as any)}
          />
          {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
            <Card key={tx.id} style={styles.txItem}>
              <View style={[styles.txIconWrap, { backgroundColor: tx.type === 'income' ? COLORS.income + '20' : COLORS.bg3 }]}>
                {tx.type === 'income' ? <Banknote size={16} color={COLORS.income} /> : <ShoppingBag size={16} color={COLORS.primary} />}
              </View>
              <View style={styles.txBody}>
                <Text style={styles.txTitle}>{tx.description}</Text>
                <Text style={styles.txSub}>{tx.category.toUpperCase()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? COLORS.income : COLORS.expense }]}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </Text>
                <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}</Text>
              </View>
            </Card>
          )) : (
            <EmptyState message="No transactions yet" />
          )}
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, backgroundColor: COLORS.bg0 },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { color: COLORS.primaryDark, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: { marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  section: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  trendTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  trendSub: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  savingsCard: {
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  savingsTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  savingRow: { width: '100%' },
  savingRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  savingLabel: { color: COLORS.textPrimary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  savingTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  savingFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: 'transparent',
    elevation: 0,
  },
  txIconWrap: {
    width: 40, height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bg3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txBody: { flex: 1 },
  txTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  txSub: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  txDate: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600' },
});