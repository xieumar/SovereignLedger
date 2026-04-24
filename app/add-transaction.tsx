import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, Upload, CheckCircle2, User, AlignLeft, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button, Card } from '@/components/ui';

const { width: W } = Dimensions.get('window');

type Tab = 'Manual' | 'Capture' | 'UploadData';

export default function AddTransactionScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Manual');
  const [amount, setAmount] = useState('0.00');
  const [isIncome, setIsIncome] = useState(false);

  const KeypadButton = ({ val, onPress }: { val: string, onPress: (v: string) => void }) => (
    <TouchableOpacity style={styles.keyBtn} onPress={() => onPress(val)}>
      <Text style={styles.keyText}>{val}</Text>
    </TouchableOpacity>
  );

  const handleKeyPress = (val: string) => {
    if (val === 'back') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0.00');
      return;
    }
    setAmount(prev => {
      if (prev === '0.00') return val === '.' ? '0.' : val;
      if (val === '.' && prev.includes('.')) return prev;
      return prev + val;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Top Tab Bar */}
      <View style={styles.tabBar}>
        {(['Manual', 'Capture', 'UploadData'] as Tab[]).map((t) => (
          <TouchableOpacity 
            key={t} 
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'UploadData' ? 'Upload Data' : t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'Manual' && (
          <View style={styles.manualView}>
            {/* Type Selector (Expenses/Income) */}
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeBtn, !isIncome && styles.typeBtnActive]}
                onPress={() => setIsIncome(false)}
              >
                <Text style={[styles.typeText, !isIncome && styles.typeTextActive]}>Expenses</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, isIncome && styles.typeBtnActive]}
                onPress={() => setIsIncome(true)}
              >
                <Text style={[styles.typeText, isIncome && styles.typeTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <Card style={styles.formCard}>
              <View style={styles.inputRow}>
                <Text style={styles.label}>ADD TRANSACTION</Text>
                <View style={styles.inputWrap}>
                  <User size={18} color={COLORS.textMuted} />
                  <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor={COLORS.textMuted} />
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>ADD TRANSACTION</Text>
                <View style={styles.inputWrap}>
                  <Calendar size={18} color={COLORS.textMuted} />
                  <Text style={styles.inputPlaceholder}>11/24/2023</Text>
                </View>
              </View>
              <View style={[styles.inputRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
                <Text style={styles.label}>ADD ALLOCATION</Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputPlaceholder}>John Doe</Text>
                  <ChevronLeft size={18} color={COLORS.textMuted} style={{ transform: [{ rotate: '-90deg' }] }} />
                </View>
              </View>
            </Card>

            {/* Amount Display */}
            <Card style={styles.amountCard}>
              <View style={styles.amountHeader}>
                <Text style={styles.amountLabel}>AMOUNT</Text>
                <View style={styles.currencyPill}><Text style={styles.currencyText}>USD</Text></View>
              </View>
              <View style={styles.amountInputWrap}>
                <Text style={styles.currencySymbol}>$</Text>
                <Text style={styles.amountVal}>{amount}</Text>
              </View>
            </Card>

            {/* Notes */}
            <View style={styles.notesGroup}>
              <AlignLeft size={18} color={COLORS.textMuted} />
              <TextInput 
                style={styles.notesInput} 
                placeholder="What was this for?" 
                placeholderTextColor={COLORS.textMuted}
                multiline
              />
            </View>

            {/* Custom Keypad */}
            <View style={styles.keypad}>
              <View style={styles.keyRow}>
                <KeypadButton val="1" onPress={handleKeyPress} />
                <KeypadButton val="2" onPress={handleKeyPress} />
                <KeypadButton val="3" onPress={handleKeyPress} />
              </View>
              <View style={styles.keyRow}>
                <KeypadButton val="4" onPress={handleKeyPress} />
                <KeypadButton val="5" onPress={handleKeyPress} />
                <KeypadButton val="6" onPress={handleKeyPress} />
              </View>
              <View style={styles.keyRow}>
                <KeypadButton val="7" onPress={handleKeyPress} />
                <KeypadButton val="8" onPress={handleKeyPress} />
                <KeypadButton val="9" onPress={handleKeyPress} />
              </View>
              <View style={styles.keyRow}>
                <KeypadButton val="." onPress={handleKeyPress} />
                <KeypadButton val="0" onPress={handleKeyPress} />
                <TouchableOpacity style={styles.keyBtn} onPress={() => handleKeyPress('back')}>
                   <ChevronLeft size={24} color={COLORS.primaryDark} />
                </TouchableOpacity>
              </View>
            </View>

            <Button label="Save Up!" onPress={() => router.push('/transactions')} style={styles.saveBtn} size="lg" />
          </View>
        )}

        {tab === 'Capture' && (
          <View style={styles.centerView}>
            <View style={styles.placeholderBox}>
              <Camera size={48} color={COLORS.primary} strokeWidth={1} />
              <Text style={styles.placeholderTitle}>Capture something</Text>
              <Text style={styles.placeholderSub}>Figure this one out!!</Text>
            </View>
            <Button label="Save Up!" onPress={() => router.push('/transactions')} style={styles.saveBtn} size="lg" />
          </View>
        )}

        {tab === 'UploadData' && (
          <View style={styles.centerView}>
             <View style={styles.placeholderBox}>
              <Upload size={48} color={COLORS.primary} strokeWidth={1} />
              <Text style={styles.placeholderTitle}>Result of captured Data</Text>
              <Text style={styles.placeholderSub}>Figure this one out too !!</Text>
            </View>
            <Button label="Save Up!" onPress={() => router.push('/transactions')} style={styles.saveBtn} size="lg" />
          </View>
        )}
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
  
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: '#F1F5F9', 
    marginHorizontal: SPACING.md, 
    padding: 4, 
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.md },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },

  content: { padding: SPACING.md },
  
  manualView: {},
  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: SPACING.lg },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: RADIUS.lg, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  typeText: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
  typeTextActive: { color: COLORS.primary },

  formCard: { padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.lg, borderWidth: 0, shadowOpacity: 0.02 },
  inputRow: { marginBottom: SPACING.md, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  label: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  inputPlaceholder: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },

  amountCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, marginBottom: SPACING.lg, alignItems: 'center' },
  amountHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  amountLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  currencyPill: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  currencyText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  amountInputWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  currencySymbol: { fontSize: 28, fontWeight: '400', color: COLORS.primaryDark, marginTop: 4 },
  amountVal: { fontSize: 48, fontWeight: '800', color: COLORS.primaryDark },

  notesGroup: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 8, marginBottom: SPACING.xl },
  notesInput: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, paddingTop: 2 },

  keypad: { marginBottom: SPACING.xl },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  keyBtn: { 
    width: (W - 80) / 3, 
    height: 54, 
    borderRadius: RADIUS.lg, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: { fontSize: 24, fontWeight: '700', color: COLORS.primaryDark },

  saveBtn: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg, marginTop: SPACING.md },

  centerView: { alignItems: 'center', paddingTop: 40 },
  placeholderBox: { 
    width: W - 60, 
    height: 300, 
    borderRadius: RADIUS.xl, 
    borderWidth: 2, 
    borderColor: '#E2E8F0', 
    borderStyle: 'dashed', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#fff'
  },
  placeholderTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginTop: 20, marginBottom: 8 },
  placeholderSub: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
});
