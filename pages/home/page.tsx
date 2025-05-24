import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import { Image as RNImage, View } from 'react-native';

import SwipeableAudioCards from './list';

import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, getAudios, swipe } = useSwipeStore();
  const { playQuarter, audioPlayer, preloadAudio } = useAudioPlayer();
  const isTabFocused = useRef(false);

  useEffect(() => {
    const fetchAudios = async () => {
      await getAudios();
    };
    fetchAudios();
  }, [getAudios]);

  useFocusEffect(
    useCallback(() => {
      isTabFocused.current = true;

      return () => {
        isTabFocused.current = false;
      };
    }, [])
  );

  useEffect(() => {
    if (audios.length > 0 && !audioPlayer) {
      // Only start playing when no audio is currently playing
      playQuarter(audios[2], 'start');
    }
  }, [audios, audioPlayer, playQuarter]);

  const handleSwipeEnd = useCallback(
    (index: number) => {
      if (!isTabFocused.current) return;

      if (index < 0 || index >= audios.length) return;

      // Play the current audio at the same position
      if (audios[index]) playQuarter(audios[index], 'start');
      swipe(audios[index - 1]);

      // Preload next audio if available
      if (index < audios.length - 1) {
        const nextAudio = audios[index + 1];
        if (nextAudio?.audio_url) {
          preloadAudio(nextAudio.audio_url);
          RNImage.prefetch(nextAudio.cover_url);
        }
      }

      // Also preload previous audio if available for smoother back navigation
      if (index > 0) {
        const prevAudio = audios[index - 1];
        if (prevAudio?.audio_url) {
          preloadAudio(prevAudio.audio_url);
          RNImage.prefetch(prevAudio.cover_url);
        }
      }
    },
    [audios, playQuarter, preloadAudio]
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
