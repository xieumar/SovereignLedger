import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Car, Utensils, ShoppingCart } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';

export const AllocationRow = () => {
  const allocations = [
    { id: 1, icon: Car, label: 'Transport', spent: '$320', left: '$300 LEFT', progress: 0.5, color: COLORS.primary },
    { id: 2, icon: Utensils, label: 'Dining Out', spent: '$485', left: '$15 LEFT', progress: 0.95, color: COLORS.expense },
    { id: 3, icon: ShoppingCart, label: 'Groceries', spent: '$250', left: '$50 LEFT', progress: 0.8, color: COLORS.primaryDark },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
      {allocations.map((a) => {
        const Icon = a.icon;
        return (
          <View key={a.id} style={styles.tile}>
            <View style={styles.iconWrap}>
              <Icon size={14} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.categoryLabel}>{a.label}</Text>
            <Text style={styles.amount}>{a.spent}</Text>
            
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${a.progress * 100}%`, backgroundColor: a.color }]} />
            </View>
            <Text style={[styles.leftText, { color: a.color === COLORS.expense ? COLORS.expense : COLORS.textMuted }]}>{a.left}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -SPACING.md },
  content: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  tile: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minWidth: 120,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  amount: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.full,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  leftText: {
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },
});