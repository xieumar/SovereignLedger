import { COLORS, RADIUS, SPACING } from '@/constants';
import { useFinanceStore } from '@/store';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Shield,
  Video,
  X,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: W } = Dimensions.get('window');
const CIRCLE_SIZE = W * 0.72;

const CHALLENGES = [
  { id: 'blink', emoji: '👁️', text: "Blink twice if you're safe" },
  { id: 'nod', emoji: '🙂', text: 'Please nod to open' },
  { id: 'teeth', emoji: '😁', text: 'Show us your teeth!' },
  { id: 'ear', emoji: '👂', text: 'Pull your ear' },
  { id: 'squint', emoji: '😉', text: 'Squint your left eye' },
  { id: 'brows', emoji: '🤨', text: 'Raise your eyebrows' },
  { id: 'tongue', emoji: '😛', text: 'Stick out your tongue' },
  { id: 'wink', emoji: '😜', text: 'Give us a wink' },
  { id: 'smile', emoji: '😊', text: 'Smile naturally' },
  { id: 'head_l', emoji: '↩️', text: 'Turn your head left' },
  { id: 'head_r', emoji: '↪️', text: 'Turn your head right' },
];

// Shuffle and pick a subset, keeping required ones first
function pickChallenges(requiredCount = 2, totalCount = 4) {
  const required = CHALLENGES.slice(0, requiredCount);
  const optional = [...CHALLENGES.slice(requiredCount)].sort(() => Math.random() - 0.5);
  return [...required, ...optional].slice(0, totalCount);
}

type Step = 'intro' | 'challenge' | 'ready' | 'scanning' | 'success' | 'failed';

export default function LivenessScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('intro');
  const [sessionChallenges] = useState(() => pickChallenges(2, 4));
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const { setVerified } = useFinanceStore();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pillScaleAnim = useRef(new Animated.Value(0)).current;
  const pillOpacityAnim = useRef(new Animated.Value(0)).current;
  const btnOpacityAnim = useRef(new Animated.Value(0.4)).current;
  const ringColorAnim = useRef(new Animated.Value(0)).current;

  // Pulse the camera ring
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Animate challenge pill in
  useEffect(() => {
    if (step === 'challenge' || step === 'ready') {
      Animated.parallel([
        Animated.spring(pillScaleAnim, { toValue: 1, friction: 7, tension: 140, useNativeDriver: true }),
        Animated.timing(pillOpacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [step, challengeIndex]);

  // Animate button becoming active
  useEffect(() => {
    Animated.timing(btnOpacityAnim, {
      toValue: step === 'ready' ? 1 : 0.4,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleCameraArea = async () => {
    if (step === 'intro') {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert('Camera required', 'Please allow camera access to continue.');
          return;
        }
      }
      // Show first challenge
      setChallengeIndex(0);
      pillScaleAnim.setValue(0);
      pillOpacityAnim.setValue(0);
      setStep('challenge');
    } else if (step === 'challenge') {
      // Tapping camera area = completing current challenge
      const next = challengeIndex + 1;
      const newCompleted = completedCount + 1;
      setCompletedCount(newCompleted);

      if (next >= sessionChallenges.length) {
        setStep('ready');
      } else {
        // Animate out then next challenge in
        Animated.parallel([
          Animated.timing(pillScaleAnim, { toValue: 0.8, duration: 150, useNativeDriver: true }),
          Animated.timing(pillOpacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => {
          setChallengeIndex(next);
          pillScaleAnim.setValue(0);
          pillOpacityAnim.setValue(0);
          Animated.parallel([
            Animated.spring(pillScaleAnim, { toValue: 1, friction: 7, tension: 140, useNativeDriver: true }),
            Animated.timing(pillOpacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]).start();
          setStep('challenge');
        });
      }
    }
  };

  const handleStartVerification = async () => {
    if (step !== 'ready') return;
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera required', 'Please allow camera access to continue.');
        return;
      }
    }
    setStep('scanning');
    // Simulate scanning
    setTimeout(() => {
      const ok = Math.random() > 0.1;
      if (ok) {
        setStep('success');
        const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        setVerified(true, expiry);
      } else {
        setStep('failed');
      }
    }, 3000);
  };

  const handleRetry = () => {
    const fresh = pickChallenges(2, 4);
    setChallengeIndex(0);
    setCompletedCount(0);
    pillScaleAnim.setValue(0);
    pillOpacityAnim.setValue(0);
    setStep('intro');
  };

  const isVerificationStep = ['intro', 'challenge', 'ready'].includes(step);
  const currentChallenge = sessionChallenges[Math.min(challengeIndex, sessionChallenges.length - 1)];
  const isReady = step === 'ready';

  // ─── Success ────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={[styles.resultIconCircle, { backgroundColor: '#00D4AA20' }]}>
            <CheckCircle2 size={64} color={COLORS.income} />
          </View>
          <Text style={styles.resultTitle}>Verified!</Text>
          <Text style={styles.resultSub}>Your identity has been confirmed.</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.startBtnText}>Enter Dashboard →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Failed ─────────────────────────────────────────────────────────────────
  if (step === 'failed') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={[styles.resultIconCircle, { backgroundColor: '#FF475720' }]}>
            <AlertCircle size={64} color={COLORS.expense} />
          </View>
          <Text style={styles.resultTitle}>Verification Failed</Text>
          <Text style={styles.resultSub}>We couldn't confirm your liveness. Please try again.</Text>
          <TouchableOpacity style={styles.startBtn} onPress={handleRetry}>
            <Text style={styles.startBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelLink} onPress={() => router.back()}>
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main verification UI ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Shield icon */}
        <View style={styles.shieldWrap}>
          <Shield size={28} color={COLORS.primary} fill={COLORS.primary + '20'} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>We need to perform a quick liveness check</Text>

        {/* "Center your face" hint */}
        <View style={styles.hintPill}>
          <View style={styles.hintDot} />
          <Text style={styles.hintText}>Center your face in the frame</Text>
        </View>

        {/* ── Camera circle ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCameraArea}
          style={styles.cameraArea}
          disabled={step === 'ready' || step === 'scanning'}
        >
          <Animated.View style={[styles.ringOuter, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.cameraCircle}>
              {permission?.granted ? (
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="front"
                />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Video size={42} color="#B0C0D4" strokeWidth={1.5} />
                </View>
              )}

              {/* Scanning overlay */}
              {step === 'scanning' && (
                <View style={styles.scanningOverlay}>
                  <Text style={styles.scanningText}>Scanning…</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Challenge pill */}
        {(step === 'challenge' || step === 'ready') && (
          <Animated.View
            style={[
              styles.challengePill,
              {
                opacity: pillOpacityAnim,
                transform: [{ scale: pillScaleAnim }],
              },
            ]}
          >
            <Text style={styles.challengePillText}>
              {currentChallenge.emoji}  {currentChallenge.text}
            </Text>
          </Animated.View>
        )}

        {/* Challenge dots */}
        {(step === 'challenge' || step === 'ready') && (
          <View style={styles.dotsRow}>
            {sessionChallenges.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < completedCount && styles.dotDone,
                  i === challengeIndex && step === 'challenge' && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* End-to-end encrypted */}
        <View style={styles.encryptedRow}>
          <Lock size={10} color={COLORS.textMuted} />
          <Text style={styles.encryptedText}>End-to-end encrypted</Text>
        </View>

        {/* Start Verification button */}
        <Animated.View style={[styles.startBtnWrap, { opacity: btnOpacityAnim }]}>
          <TouchableOpacity
            style={[styles.startBtn, isReady && styles.startBtnActive]}
            onPress={handleStartVerification}
            disabled={!isReady}
            activeOpacity={0.85}
          >
            <Text style={[styles.startBtnText, !isReady && styles.startBtnTextDisabled]}>
              {step === 'scanning' ? 'Scanning…' : 'Start Verification →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Cancel */}
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  closeBtn: {
    padding: SPACING.sm,
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.full,
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  shieldWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  // ── Hint pill ───────────────────────────────────────────────────────────────
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
    marginBottom: SPACING.lg,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Camera circle ────────────────────────────────────────────────────────────
  cameraArea: {
    marginBottom: SPACING.lg,
  },
  ringOuter: {
    width: CIRCLE_SIZE + 10,
    height: CIRCLE_SIZE + 10,
    borderRadius: (CIRCLE_SIZE + 10) / 2,
    borderWidth: 3,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF4FF',
  },
  cameraCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#D8E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8E6FF',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 76, 198, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // ── Challenge pill ────────────────────────────────────────────────────────────
  challengePill: {
    backgroundColor: '#F5E642',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    marginBottom: SPACING.md,
    alignSelf: 'center',
    maxWidth: '90%',
    shadowColor: '#D4C200',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  challengePillText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3400',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // ── Progress dots ─────────────────────────────────────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  dotDone: {
    backgroundColor: COLORS.accent,
  },

  // ── Encrypted row ─────────────────────────────────────────────────────────────
  encryptedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: SPACING.md,
  },
  encryptedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // ── Start button ──────────────────────────────────────────────────────────────
  startBtnWrap: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#CBD5E1',
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnActive: {
    backgroundColor: COLORS.primary,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  startBtnTextDisabled: {
    color: '#94A3B8',
  },

  // ── Cancel link ───────────────────────────────────────────────────────────────
  cancelLink: {
    paddingVertical: SPACING.sm,
  },
  cancelLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Result screens ────────────────────────────────────────────────────────────
  resultPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  resultIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  resultSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
});