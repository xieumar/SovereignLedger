import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, User, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button } from '@/components/ui';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Top Header */}
        <View style={styles.header}>
           <Landmark size={20} color={COLORS.primaryDark} />
           <Text style={styles.headerTitle}>Surveying Expenses</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Secure your financial data today.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <User size={18} color={COLORS.textMuted} />
                <TextInput 
                  style={styles.input} 
                  placeholder="John Doe" 
                  placeholderTextColor={COLORS.textMuted} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Mail size={18} color={COLORS.textMuted} />
                <TextInput 
                  style={styles.input} 
                  placeholder="john@company.com" 
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color={COLORS.textMuted} />
                <TextInput 
                  style={styles.input} 
                  placeholder="••••••••" 
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry
                />
              </View>
            </View>

            <Button 
              label="Sign Up" 
              onPress={() => router.push('/verify-email' as any)} 
              style={styles.btn}
              size="lg"
              // icon={<ArrowRight size={18} color="#fff" />} // Assuming Button supports icon or just add it to label
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primaryDark },
  content: { padding: SPACING.xl, paddingTop: 40 },
  heroSection: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },
  
  form: { gap: 24 },
  inputGroup: { gap: 10 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, marginTop: 10 },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  linkText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
});
