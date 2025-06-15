import '../global.css';

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <Toaster invert />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
