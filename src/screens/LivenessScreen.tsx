import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Alert, ScrollView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ShieldCheck, Camera, AlertCircle, CheckCircle2, Eye, X, Check, Loader, Lock, Sun, HelpCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';
import { Button } from '@/components/ui';

const { width: W } = Dimensions.get('window');
const CAM_WIDTH = W - SPACING.md * 2;
const CAM_HEIGHT = CAM_WIDTH * 1.3;

type Step = 'intro' | 'scanning' | 'success' | 'failed';

const INSTRUCTIONS = [
  'Please blink now',
  'Turn your head slightly left',
  'Turn your head slightly right',
  'Smile naturally',
];

export default function LivenessScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('scanning'); // Start in scanning per the mockup right side
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { setVerified } = useFinanceStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    if (step === 'scanning') {
      startScan();
    }
  }, [step]);

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera required', 'Please allow camera access to proceed.');
        return;
      }
    }
    runLivenessSimulation();
  };

  const runLivenessSimulation = () => {
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setInstructionIndex(idx);
      const pct = (idx / INSTRUCTIONS.length) * 100;
      setProgress(pct);

      if (idx >= INSTRUCTIONS.length) {
        clearInterval(interval);
        setTimeout(() => {
          const success = Math.random() > 0.15; // 85% success rate for demo
          if (success) {
            setStep('success');
            const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
            setVerified(true, expiry);
          } else {
            setStep('failed');
          }
        }, 800);
      }
    }, 1500);
  };

  const handleSuccess = () => {
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    setStep('scanning');
    setInstructionIndex(0);
    setProgress(0);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <X size={20} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>The Sovereign Ledger</Text>
        <View style={styles.securePill}>
          <Lock size={10} color={COLORS.accentDark} />
          <Text style={styles.secureText}>SECURE LINK</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.sectionOverline}>SECURITY VERIFICATION</Text>
          <Text style={styles.title}>Biometric Liveness Verification</Text>
          <Text style={styles.subtitle}>
            Please position your face within the frame. We need to verify that your babe is not holding you ransom
          </Text>

          {step === 'scanning' && (
            <Animated.View style={[styles.scanContainer, { opacity: fadeAnim }]}>
              {/* Camera View */}
              <View style={styles.cameraWrapper}>
                {permission?.granted ? (
                  <CameraView style={styles.camera} facing="front" />
                ) : (
                  <View style={styles.cameraPlaceholder}>
                    <Camera size={40} color={COLORS.textMuted} />
                  </View>
                )}

                {/* Overlays */}
                <View style={styles.overlayContainer}>
                  <View style={styles.statusPills}>
                    <View style={[styles.statusPill, { backgroundColor: 'rgba(0, 168, 132, 0.95)' }]}>
                      <CheckCircle2 size={12} color="#fff" />
                      <Text style={styles.statusText}>Lighting conditions optimal</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: 'rgba(255, 180, 180, 0.95)' }]}>
                      <AlertCircle size={12} color={COLORS.expense} />
                      <Text style={[styles.statusText, { color: COLORS.expense }]}>Face partially obscured</Text>
                    </View>
                  </View>

                  {/* Face Bounding Box simulation */}
                  <Animated.View style={[styles.faceBox, { transform: [{ scale: pulseAnim }] }]} />

                  {/* Instruction Float */}
                  <View style={styles.instructionFloat}>
                    <Eye size={16} color={COLORS.primary} />
                    <Text style={styles.instructionFloatText}>
                      {INSTRUCTIONS[Math.min(instructionIndex, INSTRUCTIONS.length - 1)]}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Steps List */}
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepIcon, { backgroundColor: COLORS.accentDark }]}>
                    <Check size={16} color="#fff" />
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>Frame Detection</Text>
                    <Text style={styles.stepSub}>Subject centered within operational parameters.</Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <View style={[styles.stepIcon, { backgroundColor: '#E0E7FF' }]}>
                    <Loader size={16} color={COLORS.primaryLight} />
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>Liveness Challenge</Text>
                    <Text style={styles.stepSub}>Detecting active biometric movement...</Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <View style={[styles.stepIcon, { backgroundColor: '#E2E8F0' }]}>
                    <Lock size={16} color={COLORS.textMuted} />
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text style={[styles.stepTitle, { color: COLORS.textMuted }]}>Ledger Encryption</Text>
                    <Text style={styles.stepSub}>Finalizing cryptographic verification link.</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {step === 'success' && (
            <View style={styles.resultContainer}>
              <View style={[styles.resultIcon, { backgroundColor: COLORS.income + '20' }]}>
                <CheckCircle2 size={60} color={COLORS.income} />
              </View>
              <Text style={styles.resultTitle}>Verified!</Text>
              <Text style={styles.resultSub}>Your identity has been confirmed.</Text>
              <Button label="Enter Dashboard" onPress={handleSuccess} size="lg" style={styles.btn} />
            </View>
          )}

          {step === 'failed' && (
            <View style={styles.resultContainer}>
              <View style={[styles.resultIcon, { backgroundColor: COLORS.expense + '20' }]}>
                <AlertCircle size={60} color={COLORS.expense} />
              </View>
              <Text style={styles.resultTitle}>Verification Failed</Text>
              <Text style={styles.resultSub}>We couldn't confirm your liveness. Please try again.</Text>
              <Button label="Try Again" onPress={handleRetry} size="lg" style={styles.btn} />
              <Button label="Cancel Verification" onPress={() => router.back()} size="lg" variant="secondary" style={styles.btn} />
            </View>
          )}
        </View>

        {/* Footer */}
        {step === 'scanning' && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.troubleshootBtn} activeOpacity={0.8}>
              <HelpCircle size={18} color="#fff" />
              <Text style={styles.troubleshootBtnText}>Troubleshoot</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel Verification</Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>PROTECTED BY SOVEREIGN LEDGER ENCRYPTION V4.2</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // very light grey matching the design
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerBtn: {
    padding: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '700',
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  secureText: {
    color: COLORS.accentDark,
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  sectionOverline: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  scanContainer: {
    width: '100%',
  },
  cameraWrapper: {
    width: '100%',
    height: CAM_HEIGHT,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPills: {
    width: '100%',
    gap: SPACING.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  faceBox: {
    width: 220,
    height: 140,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    marginTop: 20,
  },
  instructionFloat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  instructionFloatText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  stepsList: {
    gap: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // light grey matching design
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  stepSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    gap: SPACING.sm,
  },
  troubleshootBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    gap: 8,
  },
  troubleshootBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E7FF', // very light blue
    borderRadius: RADIUS.md,
    paddingVertical: 16,
  },
  cancelBtnText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  btn: {
    width: '100%',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: SPACING.md,
    letterSpacing: 0.8,
  },
  resultContainer: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIcon: {
    width: 110, height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  resultSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
});