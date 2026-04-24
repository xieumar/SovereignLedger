import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Utensils, Film, ShoppingCart, Truck, Heart, Shirt, LayoutGrid } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Card } from '@/components/ui';

export default function CategoriesScreen() {
  const router = useRouter();

  const categories = [
    { name: 'Utilities', icon: Utensils, limit: 1200, spent: 1150, color: '#FF4757', left: '$100 LEFT' },
    { name: 'Entertainment', icon: Film, limit: 1500, spent: 1200, color: COLORS.primary, left: '$300 LEFT' },
    { name: 'Groceries', icon: ShoppingCart, limit: 1000, spent: 975, color: '#00D4AA', left: '$25 LEFT' },
    { name: 'Transportation', icon: Truck, limit: 800, spent: 850, color: '#FF4757', left: '$50 OVER' },
    { name: 'Health & Fitness', icon: Heart, limit: 1200, spent: 1120, color: COLORS.primary, left: '$80 LEFT' },
    { name: 'Clothing', icon: Shirt, limit: 1000, spent: 950, color: COLORS.primaryDark, left: '$50 LEFT' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((cat, i) => (
          <Card key={i} style={styles.catItem}>
            <View style={styles.catIconWrap}>
              <cat.icon size={16} color={COLORS.primary} />
            </View>
            <View style={styles.catBody}>
              <Text style={styles.catName}>{cat.name}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(cat.spent / cat.limit) * 100}%`, backgroundColor: cat.color }]} />
              </View>
              <View style={styles.footer}>
                <Text style={styles.amount}>${cat.spent}</Text>
                <Text style={[styles.leftText, cat.left.includes('OVER') && styles.overText]}>{cat.left}</Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Create New Category Button */}
        <TouchableOpacity 
          style={styles.createNewBtn} 
          onPress={() => router.push('/new-category' as any)}
        >
          <View style={styles.createIconWrap}>
            <LayoutGrid size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.createText}>Create New Category</Text>
        </TouchableOpacity>
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
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.primaryDark },
  content: { padding: SPACING.md },
  
  catItem: { 
    flexDirection: 'row', 
    padding: SPACING.lg, 
    borderRadius: RADIUS.xl, 
    marginBottom: SPACING.md,
    borderWidth: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  catIconWrap: {
    width: 32, height: 32, borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  catBody: { flex: 1 },
  catName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  track: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginBottom: 12, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  leftText: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5 },
  overText: { color: COLORS.expense },

  createNewBtn: {
    marginTop: SPACING.lg,
    height: 120,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  createIconWrap: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  createText: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
});
