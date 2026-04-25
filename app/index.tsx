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

  // FOR TESTING: Always go to liveness to verify the new design and camera
  return <Redirect href="/liveness" />;

  return <Redirect href="/(tabs)" />;
}