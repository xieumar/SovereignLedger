import React, { useState, useRef } from 'react';
import {
  View, TouchableOpacity, StyleSheet, Animated, Pressable,
} from 'react-native';
import {
  Plus, X, SquarePen, LayoutGrid, FileText, PiggyBank,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '@/constants';

type Action = {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  color?: string;
};

interface FloatingActionButtonProps {
  actions?: Action[];
}

const DEFAULT_ICON_SIZE = 20;

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Animation values per action item
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const bgAnim     = useRef(new Animated.Value(0)).current;
  const itemsAnim  = useRef(new Animated.Value(0)).current;

  const defaultActions: Action[] = [
    {
      icon: SquarePen,
      label: 'New Entry',
      onPress: () => { close(); router.push('/(tabs)/add-transaction' as any); },
    },
    {
      icon: LayoutGrid,
      label: 'Overview',
      onPress: () => { close(); router.push('/(tabs)'); },
    },
    {
      icon: FileText,
      label: 'Ledger',
      onPress: () => { close(); router.push('/(tabs)/transactions'); },
    },
  ];

  const items = actions ?? defaultActions;

  const openFab = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(scaleAnim,  { toValue: 1.08, friction: 8, tension: 80,  useNativeDriver: true }),
      Animated.timing(bgAnim,     { toValue: 1, duration: 220, useNativeDriver: false }),
      Animated.spring(itemsAnim,  { toValue: 1, friction: 7, tension: 100, useNativeDriver: true }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 80, useNativeDriver: true }),
      Animated.timing(bgAnim,    { toValue: 0, duration: 250, useNativeDriver: false }),
      // FIX: Use timing instead of spring for a clean, absolute fade-out
      Animated.timing(itemsAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setOpen(false));
  };

  const toggle = () => open ? close() : openFab();

  // Scrim background color
  const scrimBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(10,25,60,0)', 'rgba(10,25,60,0.45)'],
  });

  return (
    <>
      {/* Scrim — tap to close */}
      {open && (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.scrim, { backgroundColor: scrimBg }]}
          pointerEvents="box-only"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>
      )}

      {/* FAB + expanded actions — anchored bottom-right */}
      <View style={styles.anchor} pointerEvents="box-none">

        {/* Expanded action strip */}
        {open && (
          <Animated.View
            style={[
              styles.actionStrip,
              {
                // FIX: Clamp the opacity so it never bounces outside 0 and 1
                opacity: itemsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                  extrapolate: 'clamp', 
                }),
                transform: [
                  {
                    translateY: itemsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            {items.map((action, i) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.actionBtn}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <Icon size={DEFAULT_ICON_SIZE} color={COLORS.primaryDark} />
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* Main FAB button */}
        <TouchableOpacity onPress={toggle} activeOpacity={0.9} style={styles.fabTouch}>
          <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}>
            {open
              ? <X size={18} color="#fff" strokeWidth={2} />
              : <Plus size={24} color="#fff" strokeWidth={2.5} />
            }
          </Animated.View>
        </TouchableOpacity>

      </View>
    </>
  );
}

const FAB_SIZE = 56;
const ACTION_SIZE = 46;

const styles = StyleSheet.create({
  scrim: {
    zIndex: 90,
  },
  anchor: {
    position: 'absolute',
    bottom: 130, 
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  actionBtn: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fabTouch: {},
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
});