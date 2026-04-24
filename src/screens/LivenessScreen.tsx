import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Video, CheckCircle2, AlertCircle, Lock, X, Shield } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';

const { width: W } = Dimensions.get('window');
const CIRCLE_SIZE = W * 0.70;

// Required challenges first, fun ones after
const ALL_CHALLENGES = [
  { id: 'blink',  text: "Blink twice if you're safe" },
  { id: 'nod',    text: 'Please nod to open' },
  { id: 'teeth',  text: 'Show us your teeth!' },
  { id: 'ear',    text: 'Pull your ear' },
  { id: 'squint', text: 'Squint your left eye' },
  { id: 'brows',  text: 'Raise your eyebrows' },
  { id: 'tongue', text: 'Stick out your tongue' },
  { id: 'wink',   text: 'Give us a wink' },
  { id: 'smile',  text: 'Smile naturally' },
  { id: 'head_l', text: 'Turn your head left' },
  { id: 'head_r', text: 'Turn your head right' },
];

function pickChallenges(requiredCount = 2, totalCount = 3) {
  const required = ALL_CHALLENGES.slice(0, requiredCount);
  const optional = [...ALL_CHALLENGES.slice(requiredCount)].sort(() => Math.random() - 0.5);
  return [...required, ...optional].slice(0, totalCount);
}

const FACE_DETECT_MS  = 1500; // wait before first challenge
const CHALLENGE_MS    = 2500; // each challenge duration

type Phase = 'intro' | 'challenge' | 'ready' | 'scanning' | 'success' | 'failed';

export default function LivenessScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [challenges] = useState(() => pickChallenges(2, 3));
  const [idx, setIdx] = useState(-1); // -1 = not started yet
  const { setVerified } = useFinanceStore();

  // ── Animations ──────────────────────────────────────────────────────────────
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const pillScale   = useRef(new Animated.Value(0.8)).current;
  const btnOpacity  = useRef(new Animated.Value(0.45)).current;

  // Pulse ring forever
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1100, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Pill pop-in whenever idx changes while in challenge phase
  useEffect(() => {
    if (phase !== 'challenge') return;
    pillOpacity.setValue(0);
    pillScale.setValue(0.7);
    Animated.parallel([
      Animated.spring(pillScale,   { toValue: 1,   friction: 6, tension: 150, useNativeDriver: true }),
      Animated.timing(pillOpacity, { toValue: 1,   duration: 180, useNativeDriver: true }),
    ]).start();
  }, [idx, phase]);

  // Button fade in when ready
  useEffect(() => {
    Animated.timing(btnOpacity, {
      toValue: phase === 'ready' ? 1 : 0.45,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [phase]);

  // ── Step 1: Request permission immediately on mount ─────────────────────────
  useEffect(() => {
    requestPermission();
  }, []);

  // ── Step 2: Once permission granted and we're in intro, start after delay ──
  useEffect(() => {
    if (!permission?.granted || phase !== 'intro') return;
    const t = setTimeout(() => {
      setIdx(0);
      setPhase('challenge');
    }, FACE_DETECT_MS);
    return () => clearTimeout(t);
  }, [permission?.granted, phase]);

  // ── Step 3: Auto-advance through challenges ─────────────────────────────────
  useEffect(() => {
    if (phase !== 'challenge' || idx < 0) return;

    const t = setTimeout(() => {
      // Fade pill out, then advance
      Animated.parallel([
        Animated.timing(pillOpacity, { toValue: 0,    duration: 180, useNativeDriver: true }),
        Animated.timing(pillScale,   { toValue: 0.85, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        const next = idx + 1;
        if (next >= challenges.length) {
          setPhase('ready');
        } else {
          setIdx(next); // triggers the pill pop-in useEffect above
        }
      });
    }, CHALLENGE_MS);

    return () => clearTimeout(t);
  }, [phase, idx]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleStartVerification = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('scanning');
    setTimeout(() => {
      const ok = Math.random() > 0.1;
      if (ok) {
        setVerified(true, new Date(Date.now() + 30 * 60 * 1000).toISOString());
        setPhase('success');
      } else {
        setPhase('failed');
      }
    }, 2800);
  }, [phase]);

  const handleRetry = useCallback(() => {
    pillOpacity.setValue(0);
    pillScale.setValue(0.8);
    btnOpacity.setValue(0.45);
    setIdx(-1);
    setPhase('intro');
  }, []);

  // ── Current challenge ────────────────────────────────────────────────────────
  const challenge = challenges[Math.max(0, Math.min(idx, challenges.length - 1))];
  const isReady   = phase === 'ready';

  // ── Success screen ──────────────────────────────────────────────────────────
  if (phase === 'success') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={[styles.resultIconCircle, { backgroundColor: '#00D4AA20' }]}>
            <CheckCircle2 size={60} color={COLORS.income} />
          </View>
          <Text style={styles.resultTitle}>Verified!</Text>
          <Text style={styles.resultSub}>Your identity has been confirmed.</Text>
          <TouchableOpacity
            style={[styles.verifyBtn, styles.verifyBtnActive]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.verifyBtnText}>Enter Dashboard →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Failed screen ────────────────────────────────────────────────────────────
  if (phase === 'failed') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={[styles.resultIconCircle, { backgroundColor: '#FF475720' }]}>
            <AlertCircle size={60} color={COLORS.expense} />
          </View>
          <Text style={styles.resultTitle}>Verification Failed</Text>
          <Text style={styles.resultSub}>
            We couldn't confirm your liveness. Please try again.
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

  // ── Main screen ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* ── Header close button ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>

        {/* Shield icon */}
        <View style={styles.shieldWrap}>
          <Shield size={26} color={COLORS.primary} />
        </View>

        {/* Title + subtitle */}
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>We need to perform a quick liveness check</Text>

        {/* "Center your face" hint pill */}
        <View style={styles.hintPill}>
          <View style={styles.hintDot} />
          <Text style={styles.hintText}>Center your face in the frame</Text>
        </View>

        {/* ── Camera circle ── */}
        <Animated.View style={[styles.ringOuter, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.cameraCircle}>
            {permission?.granted ? (
              <CameraView style={StyleSheet.absoluteFill} facing="front" />
            ) : (
              <View style={styles.cameraPlaceholder}>
                <Video size={44} color="#9BB4D0" strokeWidth={1.4} />
              </View>
            )}

            {/* Scanning overlay */}
            {phase === 'scanning' && (
              <View style={styles.scanOverlay}>
                <Text style={styles.scanText}>Scanning…</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* ── Challenge pill (below camera) ── */}
        {phase === 'challenge' && (
          <Animated.View
            style={[
              styles.challengePill,
              { opacity: pillOpacity, transform: [{ scale: pillScale }] },
            ]}
          >
            <Text style={styles.challengeText}>{challenge.text}</Text>
          </Animated.View>
        )}

        {/* Spacer when no pill so layout doesn't jump */}
        {phase !== 'challenge' && <View style={styles.pillSpacer} />}

        {/* End-to-end encrypted */}
        <View style={styles.encRow}>
          <Lock size={10} color={COLORS.textMuted} />
          <Text style={styles.encText}>End-to-end encrypted</Text>
        </View>

        {/* ── Start Verification button ── */}
        <Animated.View style={[styles.verifyBtnWrap, { opacity: btnOpacity }]}>
          <TouchableOpacity
            style={[styles.verifyBtn, isReady && styles.verifyBtnActive]}
            onPress={handleStartVerification}
            disabled={!isReady}
            activeOpacity={0.85}
          >
            <Text style={[styles.verifyBtnText, !isReady && styles.verifyBtnTextDisabled]}>
              {phase === 'scanning' ? 'Scanning…' : 'Start Verification →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Cancel */}
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
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
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },

  // Shield
  shieldWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },

  // Text
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  // Hint pill
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 7,
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

  // Camera circle
  ringOuter: {
    width: CIRCLE_SIZE + 12,
    height: CIRCLE_SIZE + 12,
    borderRadius: (CIRCLE_SIZE + 12) / 2,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: '#D6E4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  cameraCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#C8DCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C8DCFF',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 76, 198, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.4,
  },

  // Challenge pill
  challengePill: {
    backgroundColor: '#F2E44A',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
    alignSelf: 'center',
    maxWidth: '90%',
    marginBottom: SPACING.md,
    shadowColor: '#B8A800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  challengeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3000',
    textAlign: 'center',
  },
  pillSpacer: {
    height: 52 + SPACING.md, // matches challengePill height so layout stays stable
  },

  // Encrypted
  encRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: SPACING.md,
  },
  encText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // Verify button
  verifyBtnWrap: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  verifyBtn: {
    width: '100%',
    backgroundColor: '#C8D6E5',
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnActive: {
    backgroundColor: COLORS.primary,
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  verifyBtnTextDisabled: {
    color: '#8FA3BB',
  },

  // Cancel
  cancelLink: {
    paddingVertical: SPACING.sm,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Result screens
  resultPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  resultIconCircle: {
    width: 114,
    height: 114,
    borderRadius: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.4,
  },
  resultSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
});