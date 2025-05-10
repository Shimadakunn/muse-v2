import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '~/components/ui/text';
import { Audio } from '~/store/useSwipe';

export default function AudioModal({ audio }: { audio: Audio }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
      <View className="flex-1 items-center justify-center bg-red-500">
        <Text>Audio Modal</Text>
      </View>
      <View className="flex-1 items-center justify-center bg-red-500">
        <Text>Audio Modal</Text>
      </View>
    </SafeAreaView>
  );
}
