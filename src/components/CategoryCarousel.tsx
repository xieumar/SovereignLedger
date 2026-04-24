import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Car, Utensils, ShoppingCart, Zap, Film, Heart, 
  Briefcase, ShoppingBag, Home, PiggyBank, TrendingUp, 
  Bitcoin, MoreHorizontal, Plus 
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';
import { useRouter } from 'expo-router';

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

const LABEL_MAP: any = {
  food: 'Food',
  transport: 'Travel',
  shopping: 'Shop',
  salary: 'Salary',
  rent: 'Home',
  groceries: 'Grocery',
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

export const CategoryCarousel = () => {
  const router = useRouter();
  const { budgets } = useFinanceStore();

  const seenLabels = new Set();
  const uniqueBudgets = budgets.filter(b => {
    const label = b.name || LABEL_MAP[b.category] || (b.category.charAt(0).toUpperCase() + b.category.slice(1));
    if (seenLabels.has(label)) return false;
    seenLabels.add(label);
    return true;
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
      {uniqueBudgets.map((b) => {
        const Icon = getIconForName(b.name, b.category);
        const label = b.name || LABEL_MAP[b.category] || (b.category.charAt(0).toUpperCase() + b.category.slice(1));

        return (
          <TouchableOpacity key={b.id} style={styles.tile} onPress={() => {}}>
            <View style={styles.iconWrap}>
              <Icon size={20} color={COLORS.primaryDark} strokeWidth={2.5} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{label}</Text>
          </TouchableOpacity>
        );
      })}

      {/* + New Button */}
      <TouchableOpacity 
        style={[styles.tile, styles.newTile]} 
        onPress={() => router.push('/new-category')}
      >
        <View style={styles.newIconWrap}>
          <Plus size={20} color={COLORS.primary} strokeWidth={3} />
        </View>
        <Text style={styles.newLabel}>New</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -SPACING.md },
  content: { paddingHorizontal: SPACING.md, gap: 12, paddingVertical: 10 },
  tile: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    width: 80,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  newTile: {
    backgroundColor: '#EBF4FF',
    shadowOpacity: 0,
    elevation: 0,
  },
  iconWrap: { marginBottom: 8 },
  newIconWrap: { marginBottom: 8 },
  label: { color: COLORS.primaryDark, fontSize: 11, fontWeight: '700' },
  newLabel: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
});
