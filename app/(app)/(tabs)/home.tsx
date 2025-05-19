import { useEffect } from 'react';
import { View } from 'react-native';

import SwipeableAudioCards from '~/components/SwipeableAudioCards';
import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, getAudios } = useSwipeStore();
  const { playAudio } = useAudioPlayer();

  useEffect(() => {
    getAudios();
  }, []);

  const handleSwipeEnd = (index: number) => {
    if (audios[index]) {
      playAudio(audios[index]);
    }
  };

  if (audios.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-xl">No more audios available</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Check back later for new tunes!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <SwipeableAudioCards audios={audios} onSwipeEnd={handleSwipeEnd} />
    </View>
  );
}
