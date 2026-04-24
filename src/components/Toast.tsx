import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { useToastStore } from '@/store/toast';
import { COLORS, RADIUS, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

export const Toast = () => {
  const { message, type, visible, hide } = useToastStore();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: insets.top + 10,
          useNativeDriver: true,
          damping: 15,
          stiffness: 100,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: -100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, insets.top]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="#00D4AA" />;
      case 'error': return <AlertCircle size={18} color="#FF4757" />;
      default: return <Info size={18} color={COLORS.primary} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return '#F0FDF4';
      case 'error': return '#FEF2F2';
      default: return '#EFF6FF';
    }
  };

  if (!message && !visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ translateY }],
          opacity,
          backgroundColor: getBgColor(),
        }
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.text}>{message}</Text>
        <Animated.View style={styles.closeBtn}>
          <X size={16} color={COLORS.textMuted} onPress={hide} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  closeBtn: {
    padding: 4,
  },
});
