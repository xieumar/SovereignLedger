import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { CheckCircle2, AlertCircle, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useFinanceStore } from '@/store';

const { width: W } = Dimensions.get('window');
const CIRCLE_SIZE = 220; // Reduced slightly for better fit

const LIVELINESS_SVG = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_88_3675)">
<rect x="2" y="1" width="48" height="48" rx="24" fill="#D6E3FF" shape-rendering="crispEdges"/>
<path d="M23 27.25C22.65 27.25 22.3542 27.1292 22.1125 26.8875C21.8708 26.6458 21.75 26.35 21.75 26C21.75 25.65 21.8708 25.3542 22.1125 25.1125C22.3542 24.8708 22.65 24.75 23 24.75C23.35 24.75 23.6458 24.8708 23.8875 25.1125C24.1292 25.3542 24.25 25.65 24.25 26C24.25 26.35 24.1292 26.6458 23.8875 26.8875C23.6458 27.1292 23.35 27.25 23 27.25ZM29 27.25C28.65 27.25 28.3542 27.1292 28.1125 26.8875C27.8708 26.6458 27.75 26.35 27.75 26C27.75 25.65 27.8708 25.3542 28.1125 25.1125C28.3542 24.8708 28.65 24.75 29 24.75C29.35 24.75 29.6458 24.8708 29.8875 25.1125C30.1292 25.3542 30.25 25.65 30.25 26C30.25 26.35 30.1292 26.6458 29.8875 26.8875C29.6458 27.1292 29.35 27.25 29 27.25ZM26 33C28.2333 33 30.125 32.225 31.675 30.675C33.225 29.125 34 27.2333 34 25C34 24.6 33.975 24.2125 33.925 23.8375C33.875 23.4625 33.7833 23.1 33.65 22.75C33.3 22.8333 32.95 22.8958 32.6 22.9375C32.25 22.9792 31.8833 23 31.5 23C29.9833 23 28.55 22.675 27.2 22.025C25.85 21.375 24.7 20.4667 23.75 19.3C23.2167 20.6 22.4542 21.7292 21.4625 22.6875C20.4708 23.6458 19.3167 24.3667 18 24.85C18 24.8833 18 24.9083 18 24.925C18 24.9417 18 24.9667 18 25C18 27.2333 18.775 29.125 20.325 30.675C21.875 32.225 23.7667 33 26 33ZM26 35C24.6167 35 23.3167 34.7375 22.1 34.2125C20.8833 33.6875 19.825 32.975 18.925 32.075C18.025 31.175 17.3125 30.1167 16.7875 28.9C16.2625 27.6833 16 26.3833 16 25C16 23.6167 16.2625 22.3167 16.7875 21.1C17.3125 19.8833 18.025 18.825 18.925 17.925C19.825 17.025 20.8833 16.3125 22.1 15.7875C23.3167 15.2625 24.6167 15 26 15C27.3833 15 28.6833 15.2625 29.9 15.7875C31.1167 16.3125 32.175 17.025 33.075 17.925C33.975 18.825 34.6875 19.8833 35.2125 21.1C35.7375 22.3167 36 23.6167 36 25C36 26.3833 35.7375 27.6833 35.2125 28.9C34.6875 30.1167 33.975 31.175 33.075 32.075C32.175 32.975 31.1167 33.6875 29.9 34.2125C28.6833 34.7375 27.3833 35 26 35ZM24.65 17.125C25.35 18.2917 26.3 19.2292 27.5 19.9375C28.7 20.6458 30.0333 21 31.5 21C31.7333 21 31.9583 20.9875 32.175 20.9625C32.3917 20.9375 32.6167 20.9083 32.85 20.875C32.15 19.7083 31.2 18.7708 30 18.0625C28.8 17.3542 27.4667 17 26 17C25.7667 17 25.5417 17.0125 25.325 17.0375C25.1083 17.0625 24.8833 17.0917 24.65 17.125ZM18.425 22.475C19.275 21.9917 20.0167 21.3667 20.65 20.6C21.2833 19.8333 21.7583 18.975 22.075 18.025C21.225 18.5083 20.4833 19.1333 19.85 19.9C19.2167 20.6667 18.7417 21.525 18.425 22.475Z" fill="#001B3D"/>
</g>
<defs>
<filter id="filter0_d_88_3675" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_88_3675"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_88_3675" result="shape"/>
</filter>
</defs>
</svg>`;

const CENTER_FACE_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 10H7.33333V6H6V10ZM6.66667 4.66667C6.85556 4.66667 7.01389 4.60278 7.14167 4.475C7.26944 4.34722 7.33333 4.18889 7.33333 4C7.33333 3.81111 7.26944 3.65278 7.14167 3.525C7.01389 3.39722 6.85556 3.33333 6.66667 3.33333C6.47778 3.33333 6.31944 3.39722 6.19167 3.525C6.06389 3.65278 6 3.81111 6 4C6 4.18889 6.06389 4.34722 6.19167 4.475C6.31944 4.60278 6.47778 4.66667 6.66667 4.66667ZM6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45555 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45555 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45555 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45555 13.1583 7.58889 13.3333 6.66667 13.3333ZM6.66667 12C8.15556 12 9.41667 11.4833 10.45 10.45C11.4833 9.41667 12 8.15556 12 6.66667C12 5.17778 11.4833 3.91667 10.45 2.88333C9.41667 1.85 8.15556 1.33333 6.66667 1.33333C5.17778 1.33333 3.91667 1.85 2.88333 2.88333C1.85 3.91667 1.33333 5.17778 1.33333 6.66667C1.33333 8.15556 1.85 9.41667 2.88333 10.45C3.91667 11.4833 5.17778 12 6.66667 12Z" fill="#0051D5"/>
</svg>`;

const CHALLENGES = [
  { id: 'blink', text: 'Blink Twice If you\'re safe' },
  { id: 'nod', text: 'Nod your head slowly' },
  { id: 'smile', text: 'Smile for the camera' },
];

type Phase = 'intro' | 'challenge' | 'scanning' | 'success' | 'failed';

export default function LivenessScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const { setVerified } = useFinanceStore();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    requestPermission();
  }, []);

  // Pulse animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  // Challenge transition logic
  useEffect(() => {
    if (phase !== 'challenge') return;

    pillOpacity.setValue(0);
    pillScale.setValue(0.8);
    Animated.parallel([
      Animated.spring(pillScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(pillOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (idx < CHALLENGES.length - 1) {
        setIdx(idx + 1);
      } else {
        setPhase('scanning');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [idx, phase]);

  const handleStartVerification = useCallback(() => {
    setPhase('challenge');
    setIdx(0);
  }, []);

  useEffect(() => {
    if (phase === 'scanning') {
      const timer = setTimeout(() => {
        setVerified(true, new Date(Date.now() + 30 * 60 * 1000).toISOString());
        setPhase('success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleRetry = useCallback(() => {
    setPhase('intro');
    setIdx(0);
  }, []);

  // ─── Success ─────────────────────────────────────────────────────────────────
  if (phase === 'success') {
    return (
      <SafeAreaView style={styles.centeredContainer} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={32} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Verification Successful</Text>
            <Text style={styles.successSub}>
              Connecting to your account securely...
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.primaryBtnText}>Go to Dashboard →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.encRowSimple}>
            <Lock size={12} color="#1E293B" fill="#1E293B" />
            <Text style={styles.encTextDark}>
              Secured by Enterprise Grade Encryption
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Failed ──────────────────────────────────────────────────────────────────
  if (phase === 'failed') {
    return (
      <SafeAreaView style={styles.centeredContainer} edges={['top', 'bottom']}>
        <View style={styles.resultPage}>
          <View
            style={[styles.resultIconCircle, { backgroundColor: '#FF475720' }]}
          >
            <AlertCircle size={60} color={COLORS.expense} />
          </View>
          <Text style={styles.resultTitle}>Verification Failed</Text>
          <Text style={styles.resultSub}>
            We couldn't confirm your identity. Please ensure you are in a
            well-lit area.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleRetry}
          >
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main View ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.body}>
        {/* Header Icon from Assets */}
        <View style={styles.headerIconContainer}>
          <SvgXml xml={LIVELINESS_SVG} width={52} height={52} />
        </View>

        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          We need to perform a quick liveness check
        </Text>

        {/* Instruction Tag with Asset Icon */}
        <View style={styles.instructionTag}>
          <SvgXml xml={CENTER_FACE_SVG} width={14} height={14} />
          <Text style={styles.instructionText}>
            {phase === 'scanning' ? 'Processing scan...' : 'Center your face in the frame'}
          </Text>
        </View>

        <View style={styles.mainContent}>
          {/* Circular Face Frame with Camera */}
          <Animated.View style={[styles.outerCircle, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.innerCircle}>
              {permission?.granted ? (
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="front"
                />
              ) : (
                <ActivityIndicator size="large" color={COLORS.primary} />
              )}
              {phase === 'scanning' && (
                <View style={styles.scanOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.scanText}>Scanning…</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Fixed height container for challenges to prevent layout jumps */}
          <View style={styles.challengeContainer}>
            {phase === 'challenge' && (
              <Animated.View style={[
                styles.challengePill,
                { opacity: pillOpacity, transform: [{ scale: pillScale }] }
              ]}>
                <Text style={styles.challengeText}>{CHALLENGES[idx].text}</Text>
              </Animated.View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.encRowSimple}>
            <Lock size={12} color="#1E293B" fill="#1E293B" />
            <Text style={styles.encTextDark}>End-to-end encrypted</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, phase !== 'intro' && styles.btnDisabled]}
            onPress={handleStartVerification}
            disabled={phase !== 'intro'}
          >
            <Text style={styles.primaryBtnText}>
              {phase === 'intro' ? 'Start Verification →' : 'Verifying...'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  headerIconContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#002147',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  instructionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1E0FF',
    zIndex: 10,
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002147',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  outerCircle: {
    width: 220 + 16,
    height: 220 + 16,
    borderRadius: (220 + 16) / 2,
    borderWidth: 8,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  innerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 82, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  scanText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  challengeContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  challengePill: {
    backgroundColor: '#F3E28D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 220,
  },
  challengeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#716000',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  encRowSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  encTextDark: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0052FF',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelLink: {
    paddingVertical: 10,
  },
  cancelLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0052FF',
  },
  resultPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  successCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 40,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0052FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  successSub: {
    fontSize: 14,
    color: '#64748B',
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
    color: '#1E293B',
    marginBottom: 12,
  },
  resultSub: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
});