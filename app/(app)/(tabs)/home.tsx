import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function Home() {
  const router = useRouter();
  return (
    <View className="bg-background flex-1">
      <Text>Home</Text>
      <Button title="Go to Profile" onPress={() => router.push('/profile')} />
    </View>
  );
}
