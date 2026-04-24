import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Utensils, ShoppingBag, Car, Activity, Shirt, Zap, PlusSquare, Home } from 'lucide-react-native';
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
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {['All', 'Food', 'Travel', 'Shop', 'Home', 'Health'].map((f, i) => (
            <TouchableOpacity key={i} style={[styles.filterPill, i === 0 && styles.filterPillActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Allocations</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>View All</Text>
          </TouchableOpacity>
        </View>

        {[
          { label: 'Housing', spent: 2450, total: 2500, status: 'AT LIMIT', color: '#FF4757', icon: Home },
          { label: 'Dining Out', spent: 420, total: 850, status: 'HEALTHY', color: '#00D4AA', icon: Utensils },
          { label: 'Groceries', spent: 680, total: 1200, status: 'ON TRACK', color: COLORS.primary, icon: ShoppingBag },
          { label: 'Tickets', spent: 215, total: 450, status: 'ON TRACK', color: COLORS.primaryDark, icon: Car },
        ].map((a, i) => {
          const Icon = a.icon;
          const progress = Math.min(a.spent / a.total, 1);
          return (
            <Card key={i} style={styles.allocationCard}>
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <Icon size={16} color={COLORS.primaryDark} />
                </View>
                <View style={[styles.statusBadge, { backgroundColor: a.color + '15' }]}>
                  <Text style={[styles.statusText, { color: a.color }]}>{a.status}</Text>
                </View>
              </View>
              
              <Text style={styles.cardLabel}>{a.label}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardSpent}>${a.spent.toLocaleString()}</Text>
                <Text style={styles.cardTotal}>/ ${a.total.toLocaleString()}</Text>
              </View>
              
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress * 100}%`, backgroundColor: a.color }
                  ]} 
                />
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.footerPercent}>{Math.round(progress * 100)}%</Text>
                <Text style={styles.footerLeft}>${(a.total - a.spent).toLocaleString()} LEFT</Text>
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
  
  filterScroll: { marginBottom: SPACING.xl, marginLeft: -SPACING.md, marginRight: -SPACING.md },
  filterContent: { paddingHorizontal: SPACING.md, gap: 10 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  filterPillActive: { backgroundColor: COLORS.primaryDark, borderColor: COLORS.primaryDark },
  filterText: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
  filterTextActive: { color: '#fff' },

  allocationCard: { padding: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 0, backgroundColor: '#fff', shadowOpacity: 0.02 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  iconWrap: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  
  cardLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: SPACING.md },
  cardSpent: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  cardTotal: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },

  progressTrack: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerPercent: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted },
  footerLeft: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted },

  newEntryCard: { padding: SPACING.xl, marginTop: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0' },
  newEntryIconWrap: { width: 56, height: 56, borderRadius: RADIUS.lg, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  newEntryTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  newEntrySub: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.xl },
  quickAddBtn: { width: '100%', backgroundColor: COLORS.primaryDark },
});
