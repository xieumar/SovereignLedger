import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShoppingBag, Banknote, Utensils, Smartphone, Zap, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button } from '@/components/ui';

export default function TransactionsScreen() {
  const router = useRouter();

  const ledgers = [
    { id: 1, title: 'Apple Store', sub: 'TECHNOLOGY • 2:45 PM', amount: '-$1,299.00', date: 'OCT 12', type: 'expense', icon: Smartphone, iconColor: COLORS.primaryDark },
    { id: 2, title: 'Design Payment', sub: 'PAYMENT • 1:30 PM', amount: '+$1,299.00', date: 'OCT 11', type: 'income', icon: Banknote, iconColor: '#00D4AA' },
    { id: 3, title: 'Netflix', sub: 'SUBSCRIPTION • 2:45 PM', amount: '-$1,299.00', date: 'OCT 12', type: 'expense', icon: Utensils, iconColor: COLORS.primary },
    { id: 4, title: 'Slack', sub: 'COMMUNICATION • 10:00 PM', amount: '-$8.00', date: 'OCT 11', type: 'expense', icon: ShoppingBag, iconColor: COLORS.primaryDark },
    { id: 5, title: 'Dropbox', sub: 'CLOUD STORAGE • 11:30 PM', amount: '-$15.00', date: 'OCT 13', type: 'expense', icon: Banknote, iconColor: '#00D4AA' },
    { id: 6, title: 'Trello', sub: 'PROJECT MANAGEMENT • 12:00 AM', amount: '-$9.99', date: 'OCT 14', type: 'expense', icon: Utensils, iconColor: COLORS.primaryDark },
    { id: 7, title: 'Google Workspace', sub: 'SUBSCRIPTION • 6:15 AM', amount: '-$12.00', date: 'OCT 11', type: 'expense', icon: Banknote, iconColor: '#00D4AA' },
    { id: 8, title: 'Microsoft Office 365', sub: 'SUBSCRIPTION • 7:10 PM', amount: '-$99.99', date: 'OCT 10', type: 'expense', icon: Utensils, iconColor: COLORS.primary },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Ledgers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ledgers.map((item) => (
          <View key={item.id} style={styles.txCard}>
            <View style={styles.iconContainer}>
              <item.icon size={20} color={item.iconColor} />
            </View>
            
            <View style={styles.txBody}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txSub}>{item.sub}</Text>
            </View>
            
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: item.type === 'income' ? '#00D4AA' : '#FF4757' }]}>
                {item.amount}
              </Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
          </View>
        ))}

        {/* New Entry Card */}
        <View style={styles.newEntryCard}>
          <View style={styles.newEntryIconWrap}>
            <CreditCard size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.newEntryTitle}>New Entry</Text>
          <Text style={styles.newEntrySub}>Record a new Allocation</Text>
          <Button 
            label="Quick Add" 
            onPress={() => router.push('/add-transaction' as any)} 
            style={styles.quickAddBtn} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerTitle: { color: COLORS.primaryDark, fontSize: 17, fontWeight: '800' },
  content: { padding: SPACING.md, paddingBottom: 60 },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    backgroundColor: '#F1F5F9', // Subtle gray background for the card
  },
  iconContainer: {
    width: 48, height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF', // White background for the icon
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txBody: { flex: 1 },
  txTitle: { color: '#000000', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  txSub: { color: '#64748B', fontSize: 9, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  txDate: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

  newEntryCard: { 
    padding: SPACING.xl, 
    marginTop: SPACING.xl, 
    borderRadius: RADIUS.xl, 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderWidth: 0,
  },
  newEntryIconWrap: { 
    width: 56, height: 56, borderRadius: RADIUS.xl, 
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md 
  },
  newEntryTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  newEntrySub: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', marginBottom: SPACING.xl },
  quickAddBtn: { width: '100%', backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg },
});
