import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, Mail, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button } from '@/components/ui';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const updateCode = (val: string, index: number) => {
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
         <Landmark size={20} color={COLORS.primaryDark} />
         <Text style={styles.headerTitle}>Surveying Expenses</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.verifyCard}>
          <View style={styles.iconWrap}>
            <Mail size={24} color={COLORS.primary} />
          </View>
          
          <Text style={styles.title}>Verify your identity</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit security code to{'\n'}
            <Text style={{fontWeight: '700', color: COLORS.textPrimary}}>professional@example.com</Text>
          </Text>

          <View style={styles.otpRow}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                style={styles.otpInput}
                value={digit}
                onChangeText={(v) => updateCode(v, i)}
                keyboardType="number-pad"
                maxLength={1}
                placeholder="•"
                placeholderTextColor={COLORS.textMuted}
              />
            ))}
          </View>

          <Button 
            label="Verify Code" 
            onPress={() => router.push('/liveness' as any)} 
            style={styles.btn}
            size="lg"
          />

          <TouchableOpacity style={styles.resendBtn}>
            <Text style={styles.resendText}>Didn't receive the code? <Text style={styles.linkText}>Resend code</Text></Text>
          </TouchableOpacity>
        </Card>

        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <ArrowLeft size={16} color={COLORS.textSecondary} />
          <Text style={styles.backText}>Return to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Simple internal Card for this screen to match design
const Card = ({ children, style }: any) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    gap: 8, 
    paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primaryDark },
  content: { flex: 1, padding: SPACING.xl, justifyContent: 'center' },
  
  card: {
    backgroundColor: '#fff',
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconWrap: { 
    width: 56, height: 56, borderRadius: RADIUS.lg, 
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 24 
  },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  otpInput: { 
    width: 44, height: 54, borderRadius: RADIUS.md, backgroundColor: '#fff', 
    borderWidth: 1, borderColor: '#E2E8F0', textAlign: 'center', fontSize: 20, fontWeight: '700', color: COLORS.textPrimary
  },
  
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, width: '100%', marginBottom: 24 },
  
  resendBtn: { marginBottom: 10 },
  resendText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  linkText: { color: COLORS.primary, fontWeight: '700' },
  
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40 },
  backText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
});
