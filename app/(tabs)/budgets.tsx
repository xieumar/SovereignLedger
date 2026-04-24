import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Plus, ShoppingBag, Home, Utensils, Heart, Shirt, LayoutGrid } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, Badge, Button } from '@/components/ui';

const { width: W } = Dimensions.get('window');

export default function BudgetsScreen() {
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

  const categories = [
    { id: 1, name: 'Utilities', icon: Utensils, limit: 1200, spent: 1150, color: '#FF4757' },
    { id: 2, name: 'Health & Fitness', icon: Heart, limit: 1500, spent: 500, color: COLORS.primary },
    { id: 3, name: 'Clothing', icon: Shirt, limit: 1000, spent: 800, color: COLORS.primaryDark },
  ];

  const quickCategories = [
    { name: 'Shop', icon: ShoppingBag },
    { name: 'Home', icon: Home },
    { name: 'View', icon: LayoutGrid, isAction: true },
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
        {/* Monthly Burn Card */}
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
            <View style={[styles.burnFill, { width: '50%' }]} />
          </View>
          
          <View style={styles.burnFooter}>
            <Text style={styles.burnFooterText}>50% of $8,560.00 limit</Text>
            <Text style={styles.burnFooterText}>$2,176.00 left</Text>
          </View>
        </Card>

        {/* Spending Velocity */}
        <Card style={styles.velocityCard}>
          <View style={styles.velocityHeader}>
            <View>
              <Text style={styles.velocityTitle}>Spending Velocity</Text>
              <Text style={styles.velocitySub}>Trend relative to baseline</Text>
            </View>
            <View style={styles.velocityPill}>
              <Text style={styles.velocityPillText}>↘ 12.4%</Text>
            </View>
          </View>

          <View style={styles.velocityChart}>
            {velocityData.map((d, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { height: `${d.val * 100}%` }]} />
                </View>
                <Text style={styles.barLabel}>{d.day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.remainingPill}>
            <View style={styles.remainingIconWrap}>
              <View style={styles.remainingIconInner} />
            </View>
            <Text style={styles.remainingLabel}>Budget Remaining</Text>
            <Text style={styles.remainingValue}>$1,240.00</Text>
          </View>
        </Card>

        {/* Category List */}
        <View style={styles.categoryScrollWrap}>
          <Text style={styles.categorySectionLabel}>CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {quickCategories.map((cat, i) => (
              <TouchableOpacity key={i} style={[styles.quickCatBtn, cat.isAction && styles.quickCatAction]}>
                <View style={[styles.quickCatIcon, cat.isAction && styles.quickCatIconAction]}>
                  <cat.icon size={20} color={cat.isAction ? COLORS.primary : COLORS.textPrimary} />
                </View>
                <Text style={styles.quickCatLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Add New Category Button */}
        <Button 
          label="Add New Category" 
          onPress={() => router.push('/new-category' as any)} 
          style={styles.addBtn}
          size="lg"
        />

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories' as any)}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {categories.map((cat) => (
          <Card key={cat.id} style={styles.catItem}>
            <View style={styles.catItemHeader}>
              <cat.icon size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.catItemName}>{cat.name}</Text>
            <View style={styles.catItemTrack}>
              <View style={[styles.catItemFill, { width: `${(cat.spent / cat.limit) * 100}%`, backgroundColor: cat.color }]} />
            </View>
            <View style={styles.catItemFooter}>
              <Text style={styles.catItemSpent}>${cat.spent}</Text>
              <Text style={[styles.catItemLeft, { color: cat.spent > cat.limit ? COLORS.expense : COLORS.textMuted }]}>
                ${Math.abs(cat.limit - cat.spent)} {cat.spent > cat.limit ? 'OVER' : 'LEFT'}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Placeholder Bottom Tab Highlight */}
      <View style={styles.bottomHighlight} />
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
  content: { padding: SPACING.md, paddingBottom: 140 },

  // Burn Card
  burnCard: { 
    backgroundColor: COLORS.primary, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.lg, 
    marginBottom: SPACING.md,
    borderWidth: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  burnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  burnOverline: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  burnAmount: { color: '#fff', fontSize: 28, fontWeight: '800' },
  onTrackPill: { backgroundColor: '#008A5E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  onTrackText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  burnTrack: { 
    height: 10, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: RADIUS.full, 
    marginBottom: SPACING.md, 
    overflow: 'hidden' 
  },
  burnFill: { 
    height: '100%', 
    backgroundColor: '#fff', 
    borderRadius: RADIUS.full,
    opacity: 0.9,
  },
  burnFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  burnFooterText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },

  // Velocity Card
  velocityCard: { padding: SPACING.lg, marginBottom: SPACING.lg, borderRadius: RADIUS.xl },
  velocityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  velocityTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 2 },
  velocitySub: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  velocityPill: { backgroundColor: '#E6F4F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  velocityPillText: { color: '#008A5E', fontSize: 12, fontWeight: '800' },
  
  velocityChart: { 
    height: 150, 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    justifyContent: 'space-between', 
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  barContainer: { alignItems: 'center', width: (W - 80) / 7 },
  barBg: { 
    width: 32, 
    height: 120, 
    backgroundColor: '#F1F5F9', 
    borderRadius: 8, 
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: { 
    width: '100%', 
    backgroundColor: '#8DA6CA', 
    borderRadius: 8,
  },
  barLabel: { marginTop: 8, fontSize: 10, fontWeight: '700', color: COLORS.textMuted },

  remainingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  remainingIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#008A5E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  remainingIconInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#008A5E',
  },
  remainingLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  remainingValue: { fontSize: 15, fontWeight: '800', color: '#008A5E' },

  // Categories
  categoryScrollWrap: { marginBottom: SPACING.lg },
  categorySectionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md, marginLeft: 4 },
  categoryScroll: { gap: SPACING.md, paddingLeft: 4 },
  quickCatBtn: { alignItems: 'center', gap: 8 },
  quickCatIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCatIconAction: { backgroundColor: '#E0E7FF' },
  quickCatAction: {},
  quickCatLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },

  addBtn: { marginBottom: SPACING.xl, backgroundColor: COLORS.primaryDark },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  viewAll: { fontSize: 12, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },

  catItem: { padding: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.xl },
  catItemHeader: {
    width: 32, height: 32, borderRadius: RADIUS.md, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md
  },
  catItemName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  catItemTrack: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginBottom: SPACING.md, overflow: 'hidden' },
  catItemFill: { height: '100%', borderRadius: 2 },
  catItemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catItemSpent: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  catItemLeft: { fontSize: 11, fontWeight: '700' },

  bottomHighlight: { height: 2, width: 40, backgroundColor: COLORS.primary, position: 'absolute', bottom: 10, alignSelf: 'center' },
});
