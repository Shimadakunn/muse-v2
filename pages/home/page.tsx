import { useCallback, useEffect } from 'react';
import { Image as RNImage, View } from 'react-native';

import SwipeableAudioCards from './list';

import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, getAudios, swipe } = useSwipeStore();
  const { playQuarter, audioPlayer, preloadAudio } = useAudioPlayer();

  useEffect(() => {
    const fetchAudios = async () => {
      await getAudios();
    };
    fetchAudios();
  }, [getAudios]);

  useEffect(() => {
    if (audioPlayer?.playing) audioPlayer.pause();
    if (audios[0]) playQuarter(audios[0], 'start');
  }, [audios, audioPlayer, playQuarter]);

  const handleSwipeEnd = useCallback(
    (index: number) => {
      if (index < 0 || index >= audios.length) return;
      if (audios[index]) playQuarter(audios[index], 'start');

      // if (audios[index - 1]) swipe(audios[index - 1]);

      // Preload next audio if available
      if (index < audios.length - 1) {
        const nextAudio = audios[index + 1];
        if (nextAudio?.audio_url) {
          preloadAudio(nextAudio.audio_url);
          RNImage.prefetch(nextAudio.cover_url);
        }
      }
    },
    [audios, playQuarter, swipe, preloadAudio]
  );

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
