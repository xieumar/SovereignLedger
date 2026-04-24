import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShoppingBag, Banknote, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button } from '@/components/ui';
import { useFinanceStore } from '@/store';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions } = useFinanceStore();

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Ledgers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sortedTransactions.length > 0 ? sortedTransactions.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.iconContainer}>
              {tx.type === 'income' ? (
                <Banknote size={20} color="#00D4AA" />
              ) : (
                <ShoppingBag size={20} color={COLORS.primary} />
              )}
            </View>
            
            <View style={styles.txBody}>
              <Text style={styles.txTitle}>{tx.description}</Text>
              <Text style={styles.txSub}>
                {tx.category.toUpperCase()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#00D4AA' : '#FF4757' }]}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
              </Text>
              <Text style={styles.txDate}>
                {new Date(tx.date).toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}
              </Text>
            </View>
          </View>
        )) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No records found yet.</Text>
          </View>
        )}

        {/* New Entry Card */}
        <View style={styles.newEntryCard}>
          <View style={styles.newEntryIconWrap}>
            <CreditCard size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.newEntryTitle}>New Entry</Text>
          <Text style={styles.newEntrySub}>Record a new Allocation</Text>
          <Button 
            label="Quick Add" 
            onPress={() => router.push('/add-transaction' as any)} 
            style={styles.quickAddBtn} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { color: COLORS.primaryDark, fontSize: 17, fontWeight: '800' },
  content: { padding: SPACING.md, paddingBottom: 60 },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    backgroundColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48, height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txBody: { flex: 1 },
  txTitle: { color: '#000000', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  txSub: { color: '#64748B', fontSize: 9, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  txDate: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },

  newEntryCard: { 
    padding: SPACING.xl, 
    marginTop: SPACING.xl, 
    borderRadius: RADIUS.xl, 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderWidth: 0,
  },
  newEntryIconWrap: { 
    width: 56, height: 56, borderRadius: RADIUS.xl, 
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md 
  },
  newEntryTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  newEntrySub: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', marginBottom: SPACING.xl },
  quickAddBtn: { width: '100%', backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg },
});
