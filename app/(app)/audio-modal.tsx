import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AudioCard from '~/components/AudioCard';
import { Back } from '~/components/ui';
import { useSwipeStore } from '~/store/useSwipe';

export default function AudioModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const audios = useSwipeStore((state) => state.audios);
  const router = useRouter();

  // Find the audio by ID
  const audio = audios.find((a) => a.id === id);

  if (!audio) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="p-4">
          <Back />
        </View>
        <View className="flex-1 items-center justify-center">
          <View className="text-foreground">Audio not found</View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-4" edges={['top']}>
      <View className="absolute left-1/2 top-8 h-1 w-16 -translate-x-1/2 rounded-full bg-foreground/30" />

      <AudioCard audio={audio} />
    </SafeAreaView>
  );
}
