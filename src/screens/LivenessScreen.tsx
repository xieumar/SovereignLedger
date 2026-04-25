import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Alert
} from 'react-native';
import { FaceSDK, LivenessResponse, LivenessStatus } from '@regulaforensics/face-sdk';
import { useRouter } from 'expo-router';
import { CheckCircle2, AlertCircle, Lock, X, Shield } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';

type Phase = 'intro' | 'scanning' | 'success' | 'failed' | 'initializing';

export default function LivenessScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('initializing');
  const { setVerified } = useFinanceStore();

  useEffect(() => {
    // Regula initialization
    const init = async () => {
      try {
        // Initialization is usually automatic or via a license file in assets
        // We set phase to intro once we are ready
        setPhase('intro');
      } catch (e) {
        console.error('Failed to initialize Regula Face SDK', e);
        Alert.alert('Initialization Error', 'Could not initialize face detection module.');
      }
    };
    init();
  }, []);

  const handleStartVerification = useCallback(async () => {
    setPhase('scanning');
    try {
      // Start Regula Liveness check
      // This will open a native full-screen camera UI
      const result: LivenessResponse = await FaceSDK.instance.startLiveness();

      if (result.liveness === LivenessStatus.PASSED) {
        setVerified(true, new Date(Date.now() + 30 * 60 * 1000).toISOString());
        setPhase('success');
      } else {
        // User cancelled or failed
        if (result.liveness !== LivenessStatus.UNKNOWN) {
          setPhase('failed');
        } else {
          setPhase('intro'); // Likely cancelled
        }
      }
    } catch (e) {
      console.error('Liveness Error:', e);
      setPhase('failed');
    }
  }, [setVerified]);

  const handleRetry = useCallback(() => {
    setPhase('intro');
  }, []);

  if (phase === 'initializing') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.subtitle}>Setting up secure camera...</Text>
      </View>
    );
  }

  if (phase === 'success') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={32} color="#fff" fill={COLORS.primaryDark} />
            </View>
            <Text style={styles.successTitle}>Verification Successful</Text>
            <Text style={styles.successSub}>Connecting to your account securely...</Text>
            <TouchableOpacity
              style={[styles.verifyBtn, styles.verifyBtnActive]}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.verifyBtnText}>Go to Dashboard →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.encRow}>
            <Lock size={12} color={COLORS.textMuted} />
            <Text style={styles.encText}>Secured by Enterprise Grade Encryption</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'failed') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={[styles.resultIconCircle, { backgroundColor: '#FF475720' }]}>
            <AlertCircle size={60} color={COLORS.expense} />
          </View>
          <Text style={styles.resultTitle}>Verification Failed</Text>
          <Text style={styles.resultSub}>
            We couldn't confirm your identity. Please ensure you are in a well-lit area.
          </Text>
          <TouchableOpacity
            style={[styles.verifyBtn, styles.verifyBtnActive]}
            onPress={handleRetry}
          >
            <Text style={styles.verifyBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelLink} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.shieldWrap}>
          <Shield size={32} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Secure Liveness Check</Text>
        <Text style={styles.subtitle}>Powered by Regula Professional Identity Verification</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • Ensure you are in a bright room{"\n"}
            • Remove glasses or hats{"\n"}
            • Follow the on-screen instructions
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.encRow}>
          <Shield size={10} color={COLORS.primaryDark} fill={COLORS.primaryDark} />
          <Text style={styles.encText}>End-to-end encrypted biometric data</Text>
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, styles.verifyBtnActive]}
          onPress={handleStartVerification}
          disabled={phase === 'scanning'}
        >
          {phase === 'scanning' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Start Secure Scan →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  header: {
    width: '100%',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  shieldWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  spacer: { flex: 1 },
  encRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: SPACING.md,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  encText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  verifyBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  verifyBtnActive: {
    backgroundColor: COLORS.primary,
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelLink: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  resultPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 40,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D6E4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  successSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  resultIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  resultSub: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
});