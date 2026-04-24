import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Delete } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

interface KeypadProps {
  onPress: (key: string) => void;
  onDelete: () => void;
  onContinue: () => void;
}

export const Keypad = ({ onPress, onDelete, onContinue }: KeypadProps) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((key) => (
          <TouchableOpacity 
            key={key} 
            style={styles.key} 
            onPress={() => onPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={onDelete}>
          <Delete size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: SPACING.lg,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  key: {
    width: (width - SPACING.lg * 2 - 40) / 3,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  continueBtn: {
    backgroundColor: '#D1E0FF', // Light blue from image
    height: 56,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  continueText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
