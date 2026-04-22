import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store';
import { EmptyState, Card, SectionHeader} from '@/components/ui';
import { BalanceCard } from '@/components/BalanceCard';
import { AllocationRow } from '@/components/AllocationRow';
import { SplineChart } from '@/components/SplineChart';
import { TransactionItem } from '@/components/TransactionItem';
import { COLORS, SPACING, CATEGORY_META } from '@/constants';
import {
  calcBalance, calcTotalIncome, calcTotalExpenses,
  spendingLast6Months, incomeLast6Months, last6MonthLabels,
  spendingByCategory,
} from '@/utils';

export default function OverviewScreen() {
  const router = useRouter();
  const { transactions, settings, refresh, isLoading } = useFinanceStore();

  const balance = useMemo(() => calcBalance(transactions), [transactions]);
  const income = useMemo(() => calcTotalIncome(transactions), [transactions]);
  const expenses = useMemo(() => calcTotalExpenses(transactions), [transactions]);
  const spendData = useMemo(() => spendingLast6Months(transactions), [transactions]);
  const incomeData = useMemo(() => incomeLast6Months(transactions), [transactions]);
  const monthLabels = useMemo(() => last6MonthLabels(), []);

  const recentTxs = useMemo(() => transactions.slice(0, 5), [transactions]);

  const allocations = useMemo(() => {
    const byCategory = spendingByCategory(transactions);
    return Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category: category as any,
        amount,
        change: Math.round((Math.random() * 40) - 20), // demo indicator
      }));
  }, [transactions]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>SovereignLedger</Text>
            <Text style={styles.greeting}>Your wealth overview</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications' as any)}>
              <Bell size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/settings')}>
              <Settings size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          income={income}
          expenses={expenses}
          currency={settings.currency}
          onDeposit={() => router.push({ pathname: '/(tabs)/transactions', params: { type: 'income' } })}
          onWithdraw={() => router.push({ pathname: '/(tabs)/transactions', params: { type: 'expense' } })}
          style={styles.balanceCard}
        />

        {/* Allocations */}
        {allocations.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Allocations"
              actionLabel="View All"
              onAction={() => router.push('/(tabs)/analytics')}
            />
            <AllocationRow allocations={allocations} currency={settings.currency} />
          </View>
        )}

        {/* Spending Trend */}
        <Card style={styles.section}>
          <SectionHeader
            title="Spending Trend"
            actionLabel="Details"
            onAction={() => router.push('/(tabs)/analytics')}
          />
          <SplineChart
            data={spendData}
            labels={monthLabels}
            color={COLORS.chart1}
            secondData={incomeData}
            secondColor={COLORS.income}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.chart1 }]} />
              <Text style={styles.legendLabel}>Spending</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.income, borderStyle: 'dashed', borderWidth: 1 }]} />
              <Text style={styles.legendLabel}>Income</Text>
            </View>
          </View>
        </Card>

        {/* Recent Ledger */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent Ledger"
            actionLabel="VIEW ALL"
            onAction={() => router.push('/(tabs)/transactions')}
          />
          {recentTxs.length === 0
            ? <EmptyState message="No transactions yet" subtext="Tap + to add your first entry" />
            : recentTxs.map(tx => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  currency={settings.currency}
                  onDelete={(id) => useFinanceStore.getState().removeTransaction(id)}
                />
              ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg0 },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  appName: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  greeting: { color: COLORS.textMuted, fontSize: 12 },
  headerRight: { flexDirection: 'row', gap: SPACING.sm },
  iconBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
  section: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
  chartLegend: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: COLORS.textSecondary, fontSize: 12 },
});