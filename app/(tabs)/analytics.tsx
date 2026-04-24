import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Share2, Wallet, ChevronRight, ArrowUpRight } from 'lucide-react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, SectionHeader } from '@/components/ui';

const { width: W } = Dimensions.get('window');

const DonutChart = ({ data }: { data: any[] }) => {
  const radius = 35;
  const strokeWidth = 10;
  const center = 50;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <View style={styles.donutContainer}>
      <Svg width="140" height="140" viewBox="0 0 100 100">
        <G rotation="-90" origin="50, 50">
          {data.map((item, index) => {
            const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (item.percent / 100) * circumference;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutTotalLabel}>TOTAL</Text>
        <Text style={styles.donutTotalVal}>$14.2K</Text>
      </View>
    </View>
  );
};

export default function AnalyticsScreen() {
  const [tab, setTab] = useState('Monthly');
  const router = useRouter();

  const velocityData = [
    { day: 'MON', val: 0.4 },
    { day: 'TUE', val: 0.6 },
    { day: 'WED', val: 0.9 },
    { day: 'THU', val: 0.5 },
    { day: 'FRI', val: 0.75 },
    { day: 'SAT', val: 0.7 },
    { day: 'SUN', val: 0.72 },
  ];

  const allocationData = [
    { label: 'Personal Expense', percent: 45, color: COLORS.primaryDark },
    { label: 'Investment', percent: 25, color: COLORS.primary },
    { label: 'Leisure', percent: 15, color: '#00D4AA' },
    { label: 'Other', percent: 15, color: '#E2E8F0' },
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
        <Text style={styles.sectionOverline}>PERFORMANCE ANALYTICS</Text>
        <Text style={styles.title}>Financial Insights</Text>

        {/* Tab Pills */}
        <View style={styles.tabContainer}>
          {['Daily', 'Weekly', 'Monthly'].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.tabPill, tab === t && styles.tabPillActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spending Velocity */}
        <Card style={styles.velocityCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Spending Velocity</Text>
              <Text style={styles.cardSub}>Trend relative to baseline</Text>
            </View>
            <View style={styles.growthPill}>
              <Text style={styles.growthText}>↗ 12.4%</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {velocityData.map((d, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { height: `${d.val * 100}%` }]} />
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.budgetPill}>
            <View style={styles.budgetIconWrap}>
              <View style={styles.budgetIconInner} />
            </View>
            <Text style={styles.budgetLabel}>Budget Remaining</Text>
            <Text style={styles.budgetValue}>$1,240.00</Text>
          </View>
        </Card>

        {/* September Budgets */}
        <Text style={styles.sectionLabel}>MONTHLY OVERVIEW</Text>
        <Text style={styles.sectionTitle}>September Budgets</Text>
        <Text style={styles.sectionDesc}>
          You've utilized <Text style={{fontWeight: '700', color: COLORS.primary}}>84%</Text> of your total monthly allowance. Your trajectory suggest you'll remain within limits by month-end.
        </Text>

        {/* Total Spent Card */}
        <Card style={styles.spentCard}>
          <Text style={styles.spentLabel}>Total Spent</Text>
          <Text style={styles.spentAmount}>$4,280.00</Text>
          <View style={styles.spentTrack}>
            <View style={[styles.spentFill, { width: '84%' }]} />
          </View>
          <Text style={styles.spentSub}>+$1,270.00 over budget</Text>
        </Card>

        {/* Allocation Donut */}
        <Card style={styles.allocationCard}>
          <SectionHeader title="Allocation" actionLabel="View all" onAction={() => {}} />
          <View style={styles.allocationBody}>
            <DonutChart data={allocationData} />
            <View style={styles.legend}>
              {allocationData.map((item, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendPercent}>{item.percent}%</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Smart Suggestions */}
        <SectionHeader title="Smart Suggestions" actionLabel="View all" onAction={() => {}} />
        
        <Card style={styles.suggestionCard}>
          <View style={styles.suggestionIconWrap}>
            <Share2 size={18} color={COLORS.primary} />
          </View>
          <View style={styles.suggestionBody}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionTitle}>Optimize Subscriptions</Text>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeTextGreen}>MODERATE</Text>
              </View>
            </View>
            <Text style={styles.suggestionDescText}>You have 3 monthly subscriptions with low usage/utility values for you. Take action.</Text>
            <TouchableOpacity>
              <Text style={styles.actionLink}>Take Action →</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.suggestionCard}>
          <View style={[styles.suggestionIconWrap, { backgroundColor: '#E0E7FF' }]}>
            <Wallet size={18} color={COLORS.primaryDark} />
          </View>
          <View style={styles.suggestionBody}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionTitle}>Investment Allowance</Text>
              <View style={styles.badgeBlue}>
                <Text style={styles.badgeTextBlue}>PENDING</Text>
              </View>
            </View>
            <Text style={styles.suggestionDescText}>Your lifestyle allocation is exceeding limits. Shift $200 to portfolio fund.</Text>
            <TouchableOpacity>
              <Text style={styles.actionLink}>Review Portfolio →</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Smart Allocation Card */}
        <Card style={styles.smartCard}>
          <View style={styles.gaugeContainer}>
            <Svg width="100" height="100" viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
              <Circle 
                cx="50" cy="50" r="40" 
                stroke="#00D4AA" strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={`${0.75 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                strokeLinecap="round"
                rotation="-90"
                origin="50, 50"
              />
            </Svg>
            <View style={styles.gaugeTextWrap}>
              <Text style={styles.gaugeVal}>75%</Text>
              <Text style={styles.gaugeLabel}>GOAL</Text>
            </View>
          </View>

          <Text style={styles.smartTitle}>Smart Allocation Detected</Text>
          <Text style={styles.smartDesc}>We noticed you've spent 40% less on Transportation this month. Would you like to reallocate $150 towards your Vacation Fund?</Text>
          
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

  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 4, 
    borderRadius: RADIUS.full, 
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  tabPill: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.full },
  tabPillActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryDark, fontWeight: '700' },

  velocityCard: { padding: SPACING.lg, marginBottom: SPACING.xl, borderRadius: RADIUS.xl },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  cardTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 2 },
  cardSub: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  growthPill: { backgroundColor: '#E6F4F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  growthText: { color: '#008A5E', fontSize: 12, fontWeight: '800' },
  
  chartArea: { height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: SPACING.xl },
  barWrap: { alignItems: 'center', width: (W - 80) / 7 },
  barBg: { width: 28, height: 100, backgroundColor: '#F1F5F9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#8DA6CA', borderRadius: 6 },
  barDay: { marginTop: 8, fontSize: 10, fontWeight: '700', color: COLORS.textMuted },

  budgetPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  budgetIconWrap: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#008A5E', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  budgetIconInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#008A5E' },
  budgetLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  budgetValue: { fontSize: 15, fontWeight: '800', color: '#008A5E' },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  sectionDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.lg },

  spentCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, marginBottom: SPACING.xl },
  spentLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, marginBottom: 8 },
  spentAmount: { fontSize: 32, fontWeight: '800', color: COLORS.primaryDark, marginBottom: 16 },
  spentTrack: { height: 8, backgroundColor: '#F1F5F9', borderRadius: RADIUS.full, marginBottom: 12, overflow: 'hidden' },
  spentFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
  spentSub: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },

  allocationCard: { padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.xl },
  allocationBody: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  donutContainer: { position: 'relative', width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  donutCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  donutTotalLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  donutTotalVal: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  legend: { flex: 1, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  legendPercent: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary },

  suggestionCard: { flexDirection: 'row', padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.md },
  suggestionIconWrap: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  suggestionBody: { flex: 1 },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  suggestionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  badgeGreen: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeTextGreen: { color: '#065F46', fontSize: 9, fontWeight: '800' },
  badgeBlue: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeTextBlue: { color: '#1E40AF', fontSize: 9, fontWeight: '800' },
  suggestionDescText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  actionLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  smartCard: { 
    backgroundColor: COLORS.primaryDark, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.xl, 
    marginTop: SPACING.lg,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gaugeContainer: { width: 100, height: 100, alignSelf: 'center', marginBottom: SPACING.lg, position: 'relative' },
  gaugeTextWrap: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  gaugeVal: { color: '#fff', fontSize: 20, fontWeight: '800' },
  gaugeLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  smartTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  smartDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: SPACING.xl },
  smartBtn: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: RADIUS.lg, alignItems: 'center' },
  smartBtnText: { color: COLORS.primaryDark, fontSize: 15, fontWeight: '700' },
});
