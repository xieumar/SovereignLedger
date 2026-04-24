import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Utensils, ShoppingBag, Car, Activity, Shirt, Zap, PlusSquare, Home } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, Button } from '@/components/ui';
import { useFinanceStore } from '@/store';
import { spendingByCategory, formatCompact } from '@/utils';

export default function AllocationsScreen() {
  const router = useRouter();
  const { budgets, transactions } = useFinanceStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const spendingMap = spendingByCategory(transactions);

  const displayBudgets = budgets.map(b => {
    const spent = spendingMap[b.category] || 0;
    const progress = Math.min(100, (spent / b.limit) * 100);
    
    let status: 'HEALTHY' | 'AT LIMIT' | 'ON TRACK' = 'ON TRACK';
    if (progress >= 100) status = 'AT LIMIT';
    else if (progress > 80) status = 'HEALTHY';
    
    return {
      ...b,
      spent,
      progress,
      status,
      label: b.category.toUpperCase(),
      title: b.category.charAt(0).toUpperCase() + b.category.slice(1),
    };
  });

  const filteredBudgets = activeFilter === 'All' 
    ? displayBudgets 
    : displayBudgets.filter(b => b.status === activeFilter.toUpperCase());

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <User size={18} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.appName}>Allocations</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionOverline}>FINANCIAL PLANNING</Text>
        <Text style={styles.title}>Budget Allocation</Text>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['All', 'Healthy', 'On Track', 'At Limit'].map((f) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredBudgets.map((a) => (
            <Card key={a.id} style={styles.allocationCard}>
              <View style={styles.cardTop}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>{a.label}</Text>
                  <Text style={styles.cardTitle}>{a.title}</Text>
                </View>
                <View style={[styles.statusBadge, 
                  a.status === 'AT LIMIT' && { backgroundColor: '#FFF5F5' },
                  a.status === 'HEALTHY' && { backgroundColor: '#E6F4F0' }
                ]}>
                  <Text style={[styles.statusText, 
                    a.status === 'AT LIMIT' && { color: COLORS.expense },
                    a.status === 'HEALTHY' && { color: '#008A5E' }
                  ]}>{a.status}</Text>
                </View>
              </View>

              <View style={styles.amountRow}>
                <View>
                  <Text style={styles.amtLabel}>TOTAL BUDGET</Text>
                  <Text style={styles.amtVal}>{formatCompact(a.limit)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.amtLabel}>SPENT SO FAR</Text>
                  <Text style={styles.amtVal}>{formatCompact(a.spent)}</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${a.progress}%`, backgroundColor: a.status === 'AT LIMIT' ? COLORS.expense : COLORS.primary }]} />
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.footerPercent}>{Math.round(a.progress)}%</Text>
                <Text style={styles.footerLeft}>{formatCompact(Math.max(0, a.limit - a.spent))} LEFT</Text>
              </View>
            </Card>
          ))}

          <Card style={styles.newEntryCard}>
            <View style={styles.newEntryIconWrap}>
              <PlusSquare size={24} color={COLORS.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.newEntryTitle}>New Allocation Entry</Text>
            <Text style={styles.newEntrySub}>Set a new budget goal</Text>
            <Button 
              label="New Allocation" 
              onPress={() => router.push('/new-allocation')} 
              style={styles.newEntryBtn}
              size="sm"
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center',
  },
  appName: { color: COLORS.primaryDark, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  content: { padding: SPACING.md, paddingBottom: 100 },

  sectionOverline: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.primaryDark, marginBottom: SPACING.lg },

  filterContainer: { flexDirection: 'row', marginBottom: SPACING.xl },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  filterPillActive: { backgroundColor: COLORS.primaryDark, borderColor: COLORS.primaryDark },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  filterTextActive: { color: '#fff' },

  grid: { gap: SPACING.lg },
  allocationCard: { padding: SPACING.lg, borderRadius: RADIUS.xl },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  cardHeader: { flex: 1 },
  cardLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm, backgroundColor: '#EEF3FF' },
  statusText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },

  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  amtLabel: { fontSize: 8, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  amtVal: { fontSize: 15, fontWeight: '800', color: COLORS.primaryDark },

  progressTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerPercent: { fontSize: 12, fontWeight: '800', color: COLORS.primaryDark },
  footerLeft: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },

  newEntryCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: 'transparent', marginBottom: SPACING.xl },
  newEntryIconWrap: { width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  newEntryTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  newEntrySub: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600', marginBottom: 20 },
  newEntryBtn: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg, paddingHorizontal: 24 },
});
