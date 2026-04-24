import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useFinanceStore } from '@/store';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants';

export default function Index() {
  const { isInitialized, initialize, settings } = useFinanceStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // If not verified, go to signup flow
  // (In a real app, we might check if they have an account first)
  if (!settings.isVerified) {
    return <Redirect href="/signup" />;
  }

  // If verified but expired, go to liveness
  if (settings.verificationExpiry && new Date(settings.verificationExpiry) < new Date()) {
    return <Redirect href="/liveness" />;
  }

  return <Redirect href="/(tabs)" />;
}