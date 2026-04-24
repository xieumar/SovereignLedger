import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { Button } from '@/components/ui';
import { useFinanceStore } from '@/store';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useFinanceStore();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.replace('/liveness');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
           <Landmark size={20} color={COLORS.primaryDark} />
           <Text style={styles.headerTitle}>Sovereign Ledger</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to manage your finances.</Text>
          </View>

          <View style={styles.form}>
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
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <Button 
              label={loading ? "Logging in..." : "Log In"} 
              onPress={handleLogin} 
              style={styles.btn}
              size="lg"
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={styles.linkText}>Sign Up</Text>
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
  content: { padding: SPACING.xl, paddingTop: 60 },
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
  btn: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg, marginTop: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  linkText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
});
