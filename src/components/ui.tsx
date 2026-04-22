import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
  ActivityIndicator, StyleProp
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';

// ─── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
export const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
export const Button = ({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, style,
}: ButtonProps) => {
  const containerStyle = [
    styles.btn,
    size === 'sm' && styles.btnSm,
    size === 'lg' && styles.btnLg,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'danger' && styles.btnDanger,
    variant === 'ghost' && styles.btnGhost,
    (disabled || loading) && styles.btnDisabled,
    style,
  ];
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? "#fff" : COLORS.primary} size="small" />
        : <Text style={[
            styles.btnText, 
            size === 'sm' && styles.btnTextSm, 
            variant === 'secondary' && styles.btnTextSecondary,
            variant === 'ghost' && styles.btnTextGhost
          ]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color?: string;
}
export const Badge = ({ label, color = COLORS.primary }: BadgeProps) => (
  <View style={[styles.badge, { backgroundColor: color + '22' }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}
export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Divider ───────────────────────────────────────────────────────────────────
export const Divider = () => <View style={styles.divider} />;

// ─── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  message: string;
  subtext?: string;
}
export const EmptyState = ({ message, subtext }: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>{message}</Text>
    {subtext && <Text style={styles.emptyStateSub}>{subtext}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  btn: {
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSm: { paddingVertical: 8, paddingHorizontal: SPACING.md },
  btnLg: { paddingVertical: 18, paddingHorizontal: SPACING.xl },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSecondary: { backgroundColor: '#E0E7FF', borderWidth: 0 },
  btnDanger: { backgroundColor: COLORS.expense },
  btnGhost: { backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  btnTextSm: { fontSize: 13 },
  btnTextSecondary: { color: COLORS.primaryDark },
  btnTextGhost: { color: COLORS.primary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  sectionAction: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.md,
  },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyStateText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '500' },
  emptyStateSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
});