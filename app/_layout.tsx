import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFinanceStore } from '@/store';
import { COLORS } from '@/constants';

export default function RootLayout() {
  const { initialize, isInitialized } = useFinanceStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.bg0} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg0 },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="liveness" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}