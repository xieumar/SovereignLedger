import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Utensils, Car, Banknote, ShoppingBag, Home, MoreHorizontal, Calendar, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button, Card } from '@/components/ui';

export default function NewAllocationScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0.00');
  const [timeframe, setTimeframe] = useState('Weekly');
  const [recurring, setRecurring] = useState(false);
  const [notify, setNotify] = useState(true);
  const [selectedCat, setSelectedCat] = useState('Food');

  const categories = [
    { name: 'Food', icon: Utensils },
    { name: 'Travel', icon: Car },
    { name: 'Salary', icon: Banknote },
    { name: 'Shop', icon: ShoppingBag },
    { name: 'Home', icon: Home },
    { name: 'Other', icon: MoreHorizontal },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allocation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <Card style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <Text style={styles.amountLabel}>AMOUNT</Text>
            <View style={styles.currencyPill}><Text style={styles.currencyText}>USD</Text></View>
          </View>
          <View style={styles.amountWrap}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput 
              style={styles.amountInput} 
              value={amount} 
              onChangeText={setAmount} 
              keyboardType="numeric"
            />
          </View>
        </Card>

        {/* Category Selector */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.name} 
              style={[styles.gridItem, selectedCat === cat.name && styles.gridItemActive]}
              onPress={() => setSelectedCat(cat.name)}
            >
              <View style={[styles.iconWrap, selectedCat === cat.name && styles.iconWrapActive]}>
                <cat.icon size={20} color={selectedCat === cat.name ? '#fff' : COLORS.textPrimary} />
              </View>
              <Text style={[styles.gridLabel, selectedCat === cat.name && styles.gridLabelActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timeframe */}
        <Text style={styles.sectionLabel}>Timeframe</Text>
        <View style={styles.tabContainer}>
          {['Daily', 'Weekly', 'Monthly'].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.tab, timeframe === t && styles.tabActive]}
              onPress={() => setTimeframe(t)}
            >
              <Text style={[styles.tabText, timeframe === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date & Recurring */}
        <Card style={styles.optionsCard}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Calendar size={18} color={COLORS.textMuted} />
            </View>
            <View style={styles.rowBody}>
               <Text style={styles.rowLabel}>DATE</Text>
               <Text style={styles.rowVal}>11/24/2023</Text>
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <View style={styles.refreshIcon} />
            </View>
            <Text style={styles.rowText}>Recurring Transaction</Text>
            <Switch 
              value={recurring} 
              onValueChange={setRecurring} 
              trackColor={{ false: '#E2E8F0', true: '#00D4AA' }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* Threshold Alert */}
        <Text style={styles.sectionLabel}>Threshold Alert</Text>
        <Card style={styles.alertCard}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#F1F5F9' }]}>
              <Bell size={18} color={COLORS.primary} />
            </View>
            <View style={styles.rowBody}>
               <Text style={styles.rowTitle}>Notify at 80%</Text>
               <Text style={styles.rowSub}>LIMITS ARE ALMOST UP!</Text>
            </View>
            <Switch 
              value={notify} 
              onValueChange={setNotify} 
              trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* Notes */}
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Notes</Text>
          <TextInput 
            style={styles.notesInput} 
            placeholder="What was this for?" 
            placeholderTextColor={COLORS.textMuted}
            multiline
          />
        </View>

        <Button label="Save Up!" onPress={() => router.back()} style={styles.saveBtn} size="lg" />
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

  amountCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, marginBottom: SPACING.xl, alignItems: 'center' },
  amountHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  amountLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  currencyPill: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  currencyText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  amountWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  currencySymbol: { fontSize: 28, fontWeight: '400', color: COLORS.primaryDark, marginTop: 4 },
  amountInput: { fontSize: 48, fontWeight: '800', color: COLORS.primaryDark, minWidth: 100, textAlign: 'center' },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: SPACING.xl },
  gridItem: { 
    width: (Dimensions.get('window').width - 64) / 3, 
    height: 90, 
    borderRadius: RADIUS.xl, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  gridItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  iconWrap: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: COLORS.primary },
  gridLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  gridLabelActive: { color: COLORS.primary },

  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F1F5F9', 
    padding: 4, 
    borderRadius: RADIUS.lg, 
    marginBottom: SPACING.xl 
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.md },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },

  optionsCard: { padding: 0, borderRadius: RADIUS.xl, marginBottom: SPACING.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 2 },
  rowVal: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  rowText: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  refreshIcon: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: COLORS.textMuted, borderStyle: 'dotted' },

  alertCard: { padding: 0, borderRadius: RADIUS.xl, marginBottom: SPACING.xl },
  rowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  rowSub: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5 },

  notesBox: { marginBottom: SPACING.xxl, paddingHorizontal: 4 },
  notesLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 },
  notesInput: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, minHeight: 60, textAlignVertical: 'top' },

  saveBtn: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg },
});
