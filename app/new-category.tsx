import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, AlignLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button, Card } from '@/components/ui';
import { useFinanceStore } from '@/store';

export default function NewCategoryScreen() {
  const router = useRouter();
  const { addBudget } = useFinanceStore();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState('0.00');

  const handleSave = async () => {
    const amount = parseFloat(budget);
    if (isNaN(amount) || amount <= 0 || !name) return;

    await addBudget({
      category: 'other', 
      name: name,
      limit: amount,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Category</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Form Card */}
          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CATEGORY NAME</Text>
              <View style={styles.inputWrap}>
                <User size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Category Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { borderBottomWidth: 0, marginBottom: 0 }]}>
              <Text style={styles.label}>Notes</Text>
              <View style={[styles.inputWrap, { alignItems: 'flex-start', paddingTop: 4 }]}>
                <AlignLeft size={18} color={COLORS.textMuted} />
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="What was this for?"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          </Card>

          {/* Budget Card */}
          <Card style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetLabel}>CATEGORY BUDGET</Text>
              <View style={styles.currencyPill}>
                <Text style={styles.currencyText}>USD</Text>
              </View>
            </View>
            <View style={styles.amountWrap}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>
          </Card>

          <Button 
            label="Save Up!" 
            onPress={handleSave} 
            style={styles.saveBtn}
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  
  formCard: { 
    padding: SPACING.lg, 
    borderRadius: RADIUS.xl, 
    marginBottom: SPACING.lg,
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  
  budgetCard: {
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xxl,
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  budgetLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  currencyPill: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  currencyText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  amountWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  currencySymbol: { fontSize: 32, fontWeight: '400', color: COLORS.primaryDark, marginTop: 4 },
  amountInput: { fontSize: 64, fontWeight: '800', color: COLORS.primaryDark },
  
  saveBtn: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg },
});
