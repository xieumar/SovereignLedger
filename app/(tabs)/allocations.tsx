import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Utensils, ShoppingBag, Car, Activity, Shirt, Zap, PlusSquare } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, Button } from '@/components/ui';

export default function AllocationsScreen() {
  const router = useRouter();

  const allocations = [
    { id: 1, label: 'Utilities', spent: 150, left: 150, total: 300, isOver: true, icon: Zap },
    { id: 2, label: 'Entertainment', spent: 200, left: 500, total: 700, isOver: false, icon: ShoppingBag },
    { id: 3, label: 'Groceries', spent: 250, left: 175, total: 425, isOver: false, icon: Utensils },
    { id: 4, label: 'Transportation', spent: 100, left: -65, total: 35, isOver: true, icon: Car },
    { id: 5, label: 'Health & Fitness', spent: 120, left: 300, total: 420, isOver: false, icon: Activity },
    { id: 6, label: 'Clothing', spent: 180, left: 150, total: 330, isOver: false, icon: Shirt },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <User size={18} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.appName}>Sovereign Ledger</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Allocations</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>View All</Text>
          </TouchableOpacity>
        </View>

        {allocations.map((a) => {
          const Icon = a.icon;
          const progress = Math.min(a.spent / a.total, 1);
          return (
            <Card key={a.id} style={styles.allocationCard}>
              <View style={styles.iconWrap}>
                <Icon size={16} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.cardTitle}>{a.label}</Text>
              
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress * 100}%`, backgroundColor: a.isOver ? '#D32F2F' : COLORS.primaryDark }
                  ]} 
                />
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.spentAmount}>${a.spent}</Text>
                <Text style={[styles.leftAmount, { color: a.isOver ? '#D32F2F' : COLORS.textMuted }]}>
                  {Math.abs(a.left)} {a.left < 0 ? 'OVER' : 'LEFT'}
                </Text>
              </View>
            </Card>
          );
        })}

        <Card style={styles.newEntryCard}>
          <View style={styles.newEntryIconWrap}>
            <PlusSquare size={24} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.newEntryTitle}>New Entry</Text>
          <Text style={styles.newEntrySub}>Record a new Allocation</Text>
          <Button label="Quick Add" onPress={() => {}} style={styles.quickAddBtn} />
        </Card>
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
  content: { padding: SPACING.md, paddingBottom: 120 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  sectionAction: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  allocationCard: { padding: SPACING.lg, marginBottom: SPACING.sm, borderRadius: RADIUS.xl },
  iconWrap: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  cardTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primaryDark, marginBottom: 8 },
  progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: SPACING.md },
  progressFill: { height: '100%', borderRadius: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  spentAmount: { fontSize: 18, fontWeight: '800', color: COLORS.primaryDark },
  leftAmount: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  newEntryCard: { padding: SPACING.xl, marginTop: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', backgroundColor: '#fff' },
  newEntryIconWrap: { width: 56, height: 56, borderRadius: RADIUS.lg, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  newEntryTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  newEntrySub: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.xl },
  quickAddBtn: { width: '100%', backgroundColor: COLORS.primaryDark },
});
