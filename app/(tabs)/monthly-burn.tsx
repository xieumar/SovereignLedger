import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, User, Plus, Edit2, Filter, Home, Utensils, ShoppingBag, Car } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, Button } from '@/components/ui';

export default function MonthlyBurnScreen() {
  const categories = [
    {
      id: 1, label: 'Housing', spent: 2450, total: 2500, icon: Home,
      status: 'AT LIMIT', statusColor: '#D32F2F', progressColor: '#D32F2F', used: 98, left: -50
    },
    {
      id: 2, label: 'Dining Out', spent: 420, total: 450, icon: Utensils,
      status: 'HEALTHY', statusColor: '#008A5E', progressColor: '#008A5E', used: 93, left: 30
    },
    {
      id: 3, label: 'Groceries', spent: 680, total: 1100, icon: ShoppingBag,
      status: 'ON TRACK', statusColor: COLORS.textMuted, progressColor: COLORS.primaryDark, used: 62, left: 420
    },
    {
      id: 4, label: 'Transport', spent: 215, total: 400, icon: Car,
      status: null, statusColor: null, progressColor: COLORS.primaryDark, used: 54, left: 185
    },
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
        <Text style={styles.overline}>MONTHLY BURN RATE</Text>
        <Text style={styles.title}>September Budgets</Text>
        <Text style={styles.subtitle}>
          You've utilized <Text style={{fontWeight: '800', color: COLORS.primaryDark}}>84%</Text> of your total monthly allowance. Your trajectory suggests you'll remain within limits by month-end.
        </Text>

        {/* Total Spent Card */}
        <Card style={styles.totalCard}>
          <Text style={styles.totalOverline}>Total Spent</Text>
          <Text style={styles.totalAmount}>$4,280.00</Text>
          <View style={styles.totalTrack}>
            <View style={[styles.totalFill, { width: '84%' }]} />
          </View>
          <Text style={styles.totalSub}>of $5,700.00 allowance</Text>
        </Card>

        {/* Action Buttons */}
        <Button 
          label="Add New Category" 
          onPress={() => {}} 
          style={styles.addBtn}
          // Note: using custom rendering for icon inside button would be better, but we rely on the standard Button prop for now or build custom
        />
        <Button 
          label="Edit Budgets" 
          onPress={() => {}} 
          variant="secondary"
          style={styles.editBtn}
        />

        <View style={styles.filterWrap}>
          <Filter size={14} color={COLORS.textSecondary} />
          <Text style={styles.filterText}>Sort by: Usage %</Text>
        </View>

        {/* Category List */}
        {categories.map(c => (
          <Card key={c.id} style={styles.catCard}>
            <View style={styles.catHeader}>
              <View style={styles.catIconWrap}>
                <c.icon size={16} color={COLORS.primaryDark} />
              </View>
              {c.status && (
                <View style={[styles.statusPill, { backgroundColor: c.statusColor + '15' }]}>
                  <Text style={[styles.statusText, { color: c.statusColor }]}>{c.status}</Text>
                </View>
              )}
            </View>
            <Text style={styles.catTitle}>{c.label}</Text>
            <Text style={styles.catAmount}>${c.spent.toLocaleString()} <Text style={styles.catTotal}>/ ${c.total.toLocaleString()}</Text></Text>
            
            <View style={styles.catMeta}>
              <Text style={styles.catMetaText}>USED {c.used}%</Text>
              <Text style={[styles.catMetaText, { color: c.left < 0 ? '#D32F2F' : (c.statusColor === '#008A5E' ? '#008A5E' : COLORS.textMuted) }]}>
                {c.left < 0 ? `-$${Math.abs(c.left)}` : `+$${c.left}`} LEFT
              </Text>
            </View>
            
            <View style={styles.catTrack}>
              <View style={[styles.catFill, { width: `${Math.min(c.used, 100)}%`, backgroundColor: c.progressColor }]} />
            </View>
          </Card>
        ))}

        {/* Smart Allocation */}
        <Card style={styles.smartCard}>
          <View style={styles.smartRing}>
            <View style={styles.smartRingInner}>
              <Text style={styles.smartRingVal}>75%</Text>
              <Text style={styles.smartRingLabel}>Total</Text>
            </View>
          </View>
          <Text style={styles.smartTitle}>Smart Allocation Detected</Text>
          <Text style={styles.smartDesc}>
            We noticed you've spent 40% less on Transport this month. Would you like to re-allocate $185 towards your "Vacation Fund"?
          </Text>
          <TouchableOpacity style={styles.smartBtn}>
            <Text style={styles.smartBtnText}>Allocate Now</Text>
          </TouchableOpacity>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
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
  overline: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.xl },
  totalCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, marginBottom: SPACING.xl },
  totalOverline: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 4 },
  totalAmount: { fontSize: 28, fontWeight: '800', color: COLORS.primaryDark, marginBottom: SPACING.sm },
  totalTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 8 },
  totalFill: { height: '100%', backgroundColor: COLORS.primaryDark, borderRadius: 2 },
  totalSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  addBtn: { backgroundColor: COLORS.primaryDark, marginBottom: SPACING.sm },
  editBtn: { backgroundColor: '#E0E7FF', marginBottom: SPACING.lg },
  filterWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md, marginLeft: 4 },
  filterText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  catCard: { padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.md },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  catIconWrap: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  catTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  catAmount: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  catTotal: { fontSize: 14, color: COLORS.textMuted },
  catMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catMetaText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  catTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 },
  catFill: { height: '100%', borderRadius: 3 },
  smartCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, backgroundColor: COLORS.primaryDark, marginTop: SPACING.lg, alignItems: 'center' },
  smartRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: '#00D4AA', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  smartRingInner: { alignItems: 'center' },
  smartRingVal: { color: '#fff', fontSize: 16, fontWeight: '800' },
  smartRingLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' },
  smartTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: SPACING.sm, textAlign: 'center' },
  smartDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18, textAlign: 'center', marginBottom: SPACING.xl },
  smartBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.md, width: '100%', alignItems: 'center' },
  smartBtnText: { color: COLORS.primaryDark, fontSize: 14, fontWeight: '700' },
});
