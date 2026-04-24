import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Switch, Platform, Modal, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Utensils, Car, ShoppingBag, Home, MoreHorizontal, Calendar, RefreshCcw, Bell } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';
import { useToastStore } from '@/store/toast';
import { Keypad } from '@/components/Keypad';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'transport', label: 'Travel', icon: Car },
  { id: 'groceries', label: 'Grocery', icon: ShoppingBag },
  { id: 'shopping', label: 'Shop', icon: ShoppingBag },
  { id: 'rent', label: 'Home', icon: Home },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function NewCategoryScreen() {
  const router = useRouter();
  const { addBudget } = useFinanceStore();
  const toast = useToastStore();
  
  const [amount, setAmount] = useState('0.00');
  const [selectedCat, setSelectedCat] = useState('food');
  const [timeframe, setTimeframe] = useState('Weekly');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isNotify, setIsNotify] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);

  const handleKeyPress = (key: string) => {
    setAmount(prev => {
      if (prev === '0.00') return key === '.' ? '0.' : key;
      if (key === '.' && prev.includes('.')) return prev;
      return prev + key;
    });
  };

  const handleDelete = () => {
    setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0.00');
  };

  const handleSave = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.show('Please enter a valid amount', 'error');
      return;
    }

    try {
      await addBudget({
        category: selectedCat as any,
        name: CATEGORIES.find(c => c.id === selectedCat)?.label || 'Other',
        limit: val,
        period: timeframe.toLowerCase() as any,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast.show('Allocation saved successfully!', 'success');
      router.back();
    } catch (err) {
      toast.show('Failed to save allocation', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allocation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Section */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>AMOUNT</Text>
          <TouchableOpacity style={styles.amountDisplay} onPress={() => setShowKeypad(true)}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amountText}>{amount}</Text>
          </TouchableOpacity>
          <View style={styles.usdBadge}>
            <Text style={styles.usdText}>USD</Text>
          </View>
        </View>

        {/* Category Selection */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.catItem, selectedCat === cat.id && styles.catItemActive]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <View style={[styles.catIconWrap, selectedCat === cat.id && styles.catIconWrapActive]}>
                <cat.icon size={20} color={selectedCat === cat.id ? COLORS.primary : COLORS.textSecondary} />
              </View>
              <Text style={[styles.catLabel, selectedCat === cat.id && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          <View style={styles.timeframeHeader}>
            <Text style={styles.fieldLabel}>Timeframe</Text>
            <View style={styles.segmentedControl}>
              {['Daily', 'Weekly', 'Monthly'].map((t) => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.segment, timeframe === t && styles.segmentActive]}
                  onPress={() => setTimeframe(t)}
                >
                  <Text style={[styles.segmentText, timeframe === t && styles.segmentTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Calendar size={18} color={COLORS.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>DATE</Text>
              <Text style={styles.rowValue}>11/24/2023</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <RefreshCcw size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.rowLabelMain}>Recurring Transaction</Text>
            <Switch 
              value={isRecurring} 
              onValueChange={setIsRecurring}
              trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>

          <Text style={styles.fieldLabelAlt}>Threshold Alert</Text>
          <View style={[styles.row, styles.alertRow]}>
            <View style={styles.rowIcon}>
              <Bell size={18} color={COLORS.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.alertTitle}>Notify at 80%</Text>
              <Text style={styles.alertSub}>SPENDING LIMIT</Text>
            </View>
            <Switch 
              value={isNotify} 
              onValueChange={setIsNotify}
              trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesPlaceholder}>What was this for?</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Up!</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Keypad Modal */}
      <Modal visible={showKeypad} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowKeypad(false)} />
          <Keypad 
            onPress={handleKeyPress}
            onDelete={handleDelete}
            onContinue={() => setShowKeypad(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.md, 
    height: 56,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: COLORS.primaryDark, marginRight: 40 },
  content: { padding: SPACING.lg },
  
  amountCard: { 
    backgroundColor: '#fff', 
    padding: SPACING.xl, 
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5,
  },
  amountLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12 },
  amountDisplay: { flexDirection: 'row', alignItems: 'flex-start' },
  currencySymbol: { fontSize: 24, fontWeight: '600', color: COLORS.textMuted, marginTop: 10, marginRight: 4 },
  amountText: { fontSize: 56, fontWeight: '800', color: COLORS.primaryDark },
  usdBadge: { 
    position: 'absolute', top: SPACING.md, right: SPACING.md,
    backgroundColor: COLORS.primaryDark, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 
  },
  usdText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  categoryGrid: { 
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: SPACING.xl 
  },
  catItem: { 
    width: (width - SPACING.lg * 2 - 32) / 3, 
    aspectRatio: 1, 
    backgroundColor: '#fff', 
    borderRadius: RADIUS.xl, 
    alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 12,
  },
  catItemActive: { backgroundColor: '#EBF4FF' },
  catIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  catIconWrapActive: { backgroundColor: '#fff' },
  catLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  catLabelActive: { color: COLORS.primary },

  formCard: { backgroundColor: '#fff', padding: SPACING.lg, borderRadius: RADIUS.xxl, marginBottom: SPACING.xl },
  timeframeHeader: { marginBottom: SPACING.lg },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark, marginBottom: 12 },
  fieldLabelAlt: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark, marginTop: SPACING.lg, marginBottom: 12 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: RADIUS.lg, padding: 4 },
  segment: { flex: 1, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md },
  segmentActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  segmentText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  segmentTextActive: { color: COLORS.primary },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5 },
  rowValue: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark },
  rowLabelMain: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.primaryDark },
  
  alertRow: { borderBottomWidth: 0 },
  alertTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark },
  alertSub: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5 },

  notesBox: { 
    marginTop: SPACING.md, padding: SPACING.md, backgroundColor: '#F8FAFC', borderRadius: RADIUS.lg, height: 80 
  },
  notesPlaceholder: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },

  saveBtn: { 
    backgroundColor: COLORS.primaryDark, height: 56, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 40 
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
});
