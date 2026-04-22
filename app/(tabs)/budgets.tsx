import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, MoreVertical, Home, Utensils, Scissors, TrendingDown } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card } from '@/components/ui';

export default function BudgetsScreen() {
  const router = useRouter();

  const barData = [
    { bg: 0.6, fg: 0.5 },
    { bg: 0.8, fg: 0.6 },
    { bg: 1.0, fg: 0.4 },
    { bg: 0.7, fg: 0.3 },
    { bg: 0.9, fg: 0.8 },
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
        {/* Smart Prediction */}
        <Text style={styles.sectionTitle}>Smart Prediction</Text>
        <View style={styles.predictionCard}>
          <Text style={styles.predictionOverline}>Estimated Monthly End</Text>
          <Text style={styles.predictionAmount}>$5,910.00</Text>
          <View style={styles.predictionPill}>
            <TrendingDown size={12} color="#00D4AA" />
            <Text style={styles.predictionPillText}>12% LOWER THAN LAST MONTH</Text>
          </View>
        </View>

        {/* Spending Trend */}
        <Card style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.trendTitle}>Spending Trend</Text>
              <Text style={styles.trendSub}>September 2023</Text>
            </View>
            <MoreVertical size={20} color={COLORS.textMuted} />
          </View>
          
          <View style={styles.barChart}>
            {barData.map((d, i) => (
              <View key={i} style={styles.barGroup}>
                <View style={[styles.barBg, { height: `${d.bg * 100}%` }]} />
                <View style={[styles.barFg, { height: `${d.fg * 100}%` }]} />
              </View>
            ))}
          </View>

          <View style={styles.budgetRemainingPill}>
            <Text style={styles.budgetRemainingLabel}>Budget Remaining</Text>
            <Text style={styles.budgetRemainingValue}>$1,240.00</Text>
          </View>
        </Card>

        {/* Monthly Burn */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/monthly-burn')}>
          <Card style={styles.burnCard}>
            <View style={styles.burnHeader}>
              <View>
                <Text style={styles.burnOverline}>MONTHLY BURN</Text>
                <Text style={styles.burnAmount}>$4,280.00</Text>
              </View>
              <View style={styles.onTrackPill}>
                <Text style={styles.onTrackText}>ON TRACK</Text>
              </View>
            </View>
            
            <View style={styles.burnTrack}>
              <View style={[styles.burnFill, { width: '84%' }]} />
            </View>
            
            <View style={styles.burnFooter}>
              <Text style={styles.burnFooterText}>84% OF $6,350.00 GOAL</Text>
              <Text style={styles.burnFooterText}>$2,070.00 LEFT</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Recent Allocation Adjustments */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Recent Allocation Adjustments</Text>
        <Card style={styles.adjCard}>
          <View style={styles.adjItem}>
            <View style={[styles.adjIconWrap, { backgroundColor: COLORS.primary + '15' }]}>
              <Home size={16} color={COLORS.primary} />
            </View>
            <View style={styles.adjBody}>
              <Text style={styles.adjTitle}>Housing/Utilities</Text>
              <Text style={styles.adjSub}>Increased by +$55.00</Text>
            </View>
            <Text style={styles.adjDate}>TODAY</Text>
          </View>
          
          <View style={styles.adjItem}>
            <View style={[styles.adjIconWrap, { backgroundColor: COLORS.primary + '15' }]}>
              <Utensils size={16} color={COLORS.primary} />
            </View>
            <View style={styles.adjBody}>
              <Text style={styles.adjTitle}>Dining Out</Text>
              <Text style={styles.adjSub}>Reduced by -$30.00</Text>
            </View>
            <Text style={styles.adjDate}>YESTERDAY</Text>
          </View>
          
          <View style={[styles.adjItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <View style={[styles.adjIconWrap, { backgroundColor: COLORS.primary + '15' }]}>
              <Scissors size={16} color={COLORS.primary} />
            </View>
            <View style={styles.adjBody}>
              <Text style={styles.adjTitle}>Entertainment</Text>
              <Text style={styles.adjSub}>Smart-Reallocation</Text>
            </View>
            <Text style={styles.adjDate}>SEP 12</Text>
          </View>
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
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: COLORS.textPrimary,
    marginBottom: SPACING.md, marginLeft: 4,
  },
  predictionCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  predictionOverline: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', marginBottom: 8 },
  predictionAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  predictionPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  predictionPillText: { color: '#00D4AA', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  trendCard: { padding: SPACING.lg, marginBottom: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center' },
  trendHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  trendTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  trendSub: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  barChart: { height: 140, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '90%', marginBottom: SPACING.xl },
  barGroup: { width: 36, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  barBg: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 6 },
  barFg: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#8DA6CA', borderRadius: 6 },
  budgetRemainingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: SPACING.lg, paddingVertical: 12,
    borderRadius: RADIUS.full, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: COLORS.cardBorder
  },
  budgetRemainingLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  budgetRemainingValue: { color: '#008A5E', fontSize: 14, fontWeight: '800' },
  burnCard: { padding: SPACING.lg, marginBottom: SPACING.xl, borderRadius: RADIUS.xl },
  burnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  burnOverline: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  burnAmount: { color: COLORS.primaryDark, fontSize: 24, fontWeight: '800' },
  onTrackPill: { backgroundColor: '#E6F4F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  onTrackText: { color: '#008A5E', fontSize: 10, fontWeight: '800' },
  burnTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: RADIUS.full, marginBottom: SPACING.sm, overflow: 'hidden' },
  burnFill: { height: '100%', backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.full },
  burnFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  burnFooterText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600' },
  adjCard: { padding: SPACING.md, borderRadius: RADIUS.xl },
  adjItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  adjIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  adjBody: { flex: 1 },
  adjTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  adjSub: { color: COLORS.textMuted, fontSize: 11, fontWeight: '500' },
  adjDate: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
});
