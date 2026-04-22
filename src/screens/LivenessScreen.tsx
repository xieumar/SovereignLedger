import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ShieldCheck, Camera, AlertCircle, CheckCircle2, Eye } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';
import { Button } from '@/components/ui';

const { width: W } = Dimensions.get('window');
const OVAL_W = W * 0.65;
const OVAL_H = OVAL_W * 1.25;

type Step = 'intro' | 'scanning' | 'success' | 'failed';

const INSTRUCTIONS = [
  'Position your face in the oval',
  'Look straight into the camera',
  'Blink your eyes slowly',
  'Turn your head slightly left',
  'Turn your head slightly right',
  'Smile naturally',
];

export default function LivenessScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('intro');
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { setVerified } = useFinanceStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera required', 'Please allow camera access to proceed.');
        return;
      }
    }
    setStep('scanning');
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    runLivenessSimulation();
  };

  const runLivenessSimulation = () => {
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setInstructionIndex(idx);
      const pct = (idx / INSTRUCTIONS.length) * 100;
      setProgress(pct);
      Animated.timing(progressAnim, {
        toValue: pct / 100,
        duration: 600,
        useNativeDriver: false,
      }).start();

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
    }, 1100);
  };

  const handleSuccess = () => {
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    setStep('intro');
    setInstructionIndex(0);
    setProgress(0);
    progressAnim.setValue(0);
  };

  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {step === 'intro' && (
        <Animated.View style={styles.content}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            To access your financial dashboard, we need to verify your identity using facial liveness detection.
          </Text>

          <View style={styles.featureList}>
            {[
              { icon: Camera, text: 'Uses your front camera' },
              { icon: Eye, text: 'Real-time liveness checks' },
              { icon: ShieldCheck, text: 'Data never leaves your device' },
            ].map(({ icon: Icon, text }, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Icon size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>

          <Button label="Begin Verification" onPress={startScan} size="lg" style={styles.cta} />
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {step === 'scanning' && (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.scanTitle}>Face Scan</Text>

          {/* Camera oval */}
          <View style={styles.ovalContainer}>
            <Animated.View style={[styles.ovalBorder, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.ovalInner}>
                {permission?.granted ? (
                  <CameraView
                    style={styles.camera}
                    facing="front"
                  />
                ) : (
                  <View style={styles.cameraPlaceholder}>
                    <Camera size={40} color={COLORS.textMuted} />
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Corner markers */}
            {['tl', 'tr', 'bl', 'br'].map((pos) => (
              <View key={pos} style={[styles.corner, styles[`corner_${pos}` as any]]} />
            ))}
          </View>

          {/* Instruction */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {INSTRUCTIONS[Math.min(instructionIndex, INSTRUCTIONS.length - 1)]}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{Math.round(progress)}% complete</Text>
        </Animated.View>
      )}

      {step === 'success' && (
        <View style={styles.content}>
          <View style={[styles.resultIcon, { backgroundColor: COLORS.income + '20' }]}>
            <CheckCircle2 size={60} color={COLORS.income} />
          </View>
          <Text style={styles.resultTitle}>Verified!</Text>
          <Text style={styles.resultSub}>
            Your identity has been confirmed. Welcome to SovereignLedger.
          </Text>
          <Button label="Enter Dashboard" onPress={handleSuccess} size="lg" style={styles.cta} />
        </View>
      )}

      {step === 'failed' && (
        <View style={styles.content}>
          <View style={[styles.resultIcon, { backgroundColor: COLORS.expense + '20' }]}>
            <AlertCircle size={60} color={COLORS.expense} />
          </View>
          <Text style={styles.resultTitle}>Verification Failed</Text>
          <Text style={styles.resultSub}>
            We couldn't confirm your liveness. Please ensure good lighting and try again.
          </Text>
          <Button label="Try Again" onPress={handleRetry} size="lg" style={styles.cta} />
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Continue without verification</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute', top: -80, right: -80,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: COLORS.primary + '0A',
  },
  bgCircle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.accent + '0A',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    width: '100%',
  },
  iconWrap: {
    width: 96, height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  featureList: { width: '100%', marginBottom: SPACING.xl },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  featureIcon: {
    width: 36, height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureText: { color: COLORS.textSecondary, fontSize: 14 },
  cta: { width: '100%', marginBottom: SPACING.md },
  skipBtn: { paddingVertical: SPACING.sm },
  skipText: { color: COLORS.textMuted, fontSize: 14 },

  // Scanning
  scanTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: SPACING.xl,
  },
  ovalContainer: {
    width: OVAL_W + 24,
    height: OVAL_H + 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.xl,
  },
  ovalBorder: {
    width: OVAL_W,
    height: OVAL_H,
    borderRadius: OVAL_W / 2,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalInner: { width: '100%', height: '100%', overflow: 'hidden', borderRadius: OVAL_W / 2 },
  camera: { width: '100%', height: '100%' },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24, height: 24,
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  corner_tl: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 6 },
  corner_tr: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 6 },
  corner_bl: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 6 },
  corner_br: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 6 },
  instructionBox: {
    backgroundColor: COLORS.primary + '22',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
  },
  instructionText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  progressLabel: { color: COLORS.textMuted, fontSize: 13 },

  // Result
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
} as any);