import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, User, Plus, ShoppingBag, Banknote, Utensils, Heart, Shirt, LayoutGrid, MoreHorizontal, Car, ShoppingCart, Zap, Film, Briefcase, Home, PiggyBank, TrendingUp, Bitcoin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card, Badge, Button } from '@/components/ui';
import { useFinanceStore } from '@/store';
import { calcTotalExpenses } from '@/utils';
import { SpendingVelocityCard } from '@/components/SpendingVelocityCard';
import { CategoryCarousel } from '@/components/CategoryCarousel';

const { width: W } = Dimensions.get('window');

const ICON_MAP: any = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingCart,
  utilities: Zap,
  entertainment: Film,
  health: Heart,
  salary: Briefcase,
  rent: Home,
  savings: PiggyBank,
  investment: TrendingUp,
  crypto: Bitcoin,
  other: MoreHorizontal,
};

const getIconForName = (name?: string, category?: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('food') || n.includes('eat') || n.includes('dining') || n.includes('cheese') || n.includes('restaurant')) return Utensils;
  if (n.includes('car') || n.includes('travel') || n.includes('uber') || n.includes('drive') || n.includes('transport')) return Car;
  if (n.includes('shop') || n.includes('amazon') || n.includes('buy') || n.includes('store')) return ShoppingBag;
  if (n.includes('home') || n.includes('rent') || n.includes('house')) return Home;
  if (n.includes('health') || n.includes('med') || n.includes('hospital')) return Heart;
  if (n.includes('bill') || n.includes('utility') || n.includes('electric') || n.includes('water')) return Zap;
  if (n.includes('movie') || n.includes('game') || n.includes('play') || n.includes('fun')) return Film;
  if (n.includes('salary') || n.includes('pay') || n.includes('work')) return Briefcase;
  
  return ICON_MAP[category || ''] || MoreHorizontal;
};

export default function BudgetsScreen() {
  const router = useRouter();
  const { transactions, budgets } = useFinanceStore();

  const totalExpenses = calcTotalExpenses(transactions);
  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const remainingBudget = Math.max(0, totalBudget - totalExpenses);
  const burnPercent = totalBudget > 0 ? (totalExpenses / totalBudget) : 0;

  const mockVelocityData = [30, 65, 95, 45, 80, 75, 85];

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
              <Text style={styles.burnAmount}>${totalExpenses.toLocaleString()}</Text>
            </View>
            <View style={styles.onTrackPill}>
              <Text style={styles.onTrackText}>{burnPercent < 0.9 ? 'ON TRACK' : 'WARNING'}</Text>
            </View>
          </View>
          
          <View style={styles.burnTrack}>
            <View style={[styles.burnFill, { width: `${Math.min(1, burnPercent) * 100}%` }]} />
          </View>
          
          <View style={styles.burnFooter}>
            <Text style={styles.burnFooterText}>{Math.round(burnPercent * 100)}% of ${totalBudget.toLocaleString()} limit</Text>
            <Text style={styles.burnFooterText}>${remainingBudget.toLocaleString()} left</Text>
          </View>
        </Card>

        {/* Spending Velocity */}
        <View style={styles.section}>
          <SpendingVelocityCard 
            remaining={remainingBudget}
            velocity={12.4}
            data={mockVelocityData}
          />
        </View>

        {/* Category List */}
        <Card style={styles.categoryCard}>
          <Text style={styles.categoryLabel}>CATEGORY</Text>
          <CategoryCarousel />
          
          <Button 
            label="Add New Category" 
            onPress={() => router.push('/new-category')} 
            style={styles.addBtn}
            size="lg"
          />
        </Card>

        {/* Categories Detail Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Breakdown</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/allocations')}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {(() => {
          const seenLabels = new Set();
          return budgets.filter(b => {
            const rawLabel = b.name || ICON_MAP[b.category] ? (b.category.charAt(0).toUpperCase() + b.category.slice(1).replace('-', ' ')) : 'Other'; 
            // Wait, let me use a simpler robust check
            const label = (b.name || b.category).trim().toLowerCase();
            if (seenLabels.has(label)) return false;
            seenLabels.add(label);
            return true;
          }).map((b) => {
            const spent = transactions.filter(t => t.category === b.category).reduce((acc, t) => acc + t.amount, 0);
            const Icon = getIconForName(b.name, b.category);
            return (
              <Card key={b.id} style={styles.catItem}>
                <View style={styles.catItemHeader}>
                  <Icon size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.catItemName}>{b.name || b.category.toUpperCase()}</Text>
                <View style={styles.catItemTrack}>
                  <View style={[styles.catItemFill, { width: `${Math.min(1, spent/b.limit) * 100}%`, backgroundColor: COLORS.primary }]} />
                </View>
                <View style={styles.catItemFooter}>
                  <Text style={styles.catItemSpent}>${spent.toLocaleString()}</Text>
                  <Text style={[styles.catItemLeft, { color: spent > b.limit ? COLORS.expense : COLORS.textMuted }]}>
                    ${Math.max(0, b.limit - spent).toLocaleString()} LEFT
                  </Text>
                </View>
              </Card>
            );
          });
        })()}
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
  content: { padding: SPACING.md, paddingBottom: 140 },
  section: { marginBottom: SPACING.lg },

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

  categoryCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    backgroundColor: '#fff',
    marginBottom: SPACING.xl,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  addBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.primaryDark },

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
});
