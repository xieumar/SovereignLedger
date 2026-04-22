import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Settings, User, ScanLine, Edit, CreditCard, Wallet, MoreHorizontal, ShoppingBag, Banknote, Utensils } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store';
import { EmptyState, Card, SectionHeader} from '@/components/ui';
import { BalanceCard } from '@/components/BalanceCard';
import { AllocationRow } from '@/components/AllocationRow';
import { SplineChart } from '@/components/SplineChart';
import { COLORS, SPACING, RADIUS } from '@/constants';

export default function OverviewScreen() {
  const router = useRouter();
  const { settings, refresh, isLoading } = useFinanceStore();

  const spendData = [120, 200, 150, 300];
  const monthLabels = ['W1', 'W2', 'W3', 'W4'];

  const savings = [
    { label: 'INVESTMENTS', percent: 65, color: COLORS.primary },
    { label: 'CASH SAVINGS', percent: 25, color: COLORS.primaryLight },
    { label: 'CRYPTO VAULT', percent: 10, color: COLORS.accent },
  ];

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
          balance={42950.40}
          income={0}
          expenses={0}
          currency={settings.currency}
          onDeposit={() => {}}
          onWithdraw={() => {}}
          style={styles.balanceCard}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionBtn}>
            <ScanLine size={20} color={COLORS.primaryLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Edit size={20} color={COLORS.primaryLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <CreditCard size={20} color={COLORS.accentDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Wallet size={20} color={COLORS.accentDark} />
          </TouchableOpacity>
        </View>

        {/* Allocations */}
        <View style={styles.section}>
          <SectionHeader
            title="Allocations"
            actionLabel="View All"
            onAction={() => {}}
          />
          <AllocationRow />
        </View>

        {/* Spending Trend */}
        <Card style={styles.section}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.trendTitle}>Spending Trend</Text>
              <Text style={styles.trendSub}>OCT 1 - OCT 15, 2023</Text>
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
            <Text style={styles.savingsTitle}>Savings</Text>
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
            onAction={() => {}}
          />
          <Card style={styles.txItem}>
            <View style={styles.txIconWrap}>
              <ShoppingBag size={16} color={COLORS.primary} />
            </View>
            <View style={styles.txBody}>
              <Text style={styles.txTitle}>Apple Store</Text>
              <Text style={styles.txSub}>TECHNOLOGY • 2:45 PM</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: COLORS.expense }]}>-$1,299.00</Text>
              <Text style={styles.txDate}>OCT 12</Text>
            </View>
          </Card>
          <Card style={styles.txItem}>
            <View style={[styles.txIconWrap, { backgroundColor: COLORS.income + '20' }]}>
              <Banknote size={16} color={COLORS.income} />
            </View>
            <View style={styles.txBody}>
              <Text style={styles.txTitle}>Dividend Payout</Text>
              <Text style={styles.txSub}>INVESTMENT • 11:30 AM</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: COLORS.income }]}>+$450.25</Text>
              <Text style={styles.txDate}>OCT 11</Text>
            </View>
          </Card>
          <Card style={styles.txItem}>
            <View style={styles.txIconWrap}>
              <Utensils size={16} color={COLORS.primary} />
            </View>
            <View style={styles.txBody}>
              <Text style={styles.txTitle}>The Gilded Fork</Text>
              <Text style={styles.txSub}>DINING • 8:15 PM</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: COLORS.expense }]}>-$240.50</Text>
              <Text style={styles.txDate}>OCT 10</Text>
            </View>
          </Card>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  quickActionBtn: {
    width: 54, height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
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