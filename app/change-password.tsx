import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button, Card } from '@/components/ui';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const Requirement = ({ label, met }: { label: string, met: boolean }) => (
    <View style={styles.reqItem}>
      <CheckCircle2 size={16} color={met ? '#00D4AA' : '#E2E8F0'} />
      <Text style={[styles.reqText, met && styles.reqTextMet]}>{label}</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Icon Area */}
          <View style={styles.iconSection}>
            <View style={styles.shieldWrap}>
              <ShieldCheck size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.mainTitle}>Change Password</Text>
            <Text style={styles.subtitle}>Update your credentials to maintain account security and data protection.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrap}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showCurrent}
                  placeholder="Enter current password"
                  placeholderTextColor={COLORS.textMuted}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrap}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showNew}
                  placeholder="At least 12 characters"
                  placeholderTextColor={COLORS.textMuted}
                  value="P-@ssw0rd!2024"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
                </TouchableOpacity>
              </View>
              
              {/* Strength Indicator */}
              <View style={styles.strengthRow}>
                <Text style={styles.strengthLabel}>Strength: <Text style={{color: '#00D4AA'}}>Strong</Text></Text>
                <View style={styles.strengthBars}>
                  {[1, 1, 1, 1].map((v, i) => (
                    <View key={i} style={[styles.bar, { backgroundColor: COLORS.primary }]} />
                  ))}
                </View>
              </View>
            </View>

            {/* Security Requirements */}
            <Card style={styles.reqCard}>
              <Text style={styles.reqTitle}>SECURITY REQUIREMENTS</Text>
              <Requirement label="At least 12 characters long" met={true} />
              <Requirement label="Contains uppercase & lowercase letters" met={true} />
              <Requirement label="Contains numbers or symbols" met={true} />
            </Card>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrap}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showConfirm}
                  placeholder="Repeat new password"
                  placeholderTextColor={COLORS.textMuted}
                  value="P-@ssw0rd!2024"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Button 
            label="Update Password" 
            onPress={() => router.back()} 
            style={styles.updateBtn}
            size="lg"
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>Your connection is secure and encrypted.</Text>
          </View>
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
  content: { padding: SPACING.lg },

  iconSection: { alignItems: 'center', marginBottom: SPACING.xl },
  shieldWrap: { 
    width: 64, height: 64, borderRadius: 32, 
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 
  },
  mainTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primaryDark, marginBottom: 8 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  form: { marginBottom: SPACING.xl },
  inputGroup: { marginBottom: SPACING.lg },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 10 },
  inputWrap: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },

  strengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  strengthLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  strengthBars: { flexDirection: 'row', gap: 4 },
  bar: { width: 30, height: 4, borderRadius: 2 },

  reqCard: { padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.xl, backgroundColor: '#F8FAFC', borderStyle: 'dashed' },
  reqTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reqText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  reqTextMet: { color: COLORS.textPrimary },

  updateBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, marginBottom: 12 },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },

  footerNote: { marginTop: 40, alignItems: 'center' },
  footerNoteText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
});
