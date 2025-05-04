import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '~/store/useAuth';

export default function ProtectedLayout() {
  const session = useAuthStore((s) => s.session);
  const router = useRouter();

  useEffect(() => {
    if (!session) router.replace('/(auth)');
  }, [session]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="messages" />
    </Stack>
  );
}
