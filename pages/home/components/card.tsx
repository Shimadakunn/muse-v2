import { Image } from 'expo-image';
import { memo } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio as AudioType } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
  onNavigateToNext?: () => void;
  onNavigateToPrevious?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const AnimatedImage = Animated.createAnimatedComponent(Image);

function AudioCard({ audio, onNavigateToNext, onNavigateToPrevious }: AudioProps) {
  const { playQuarter, playPauseAudio, position, duration } = useAudioPlayer();

  const handleImagePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const imageWidth = CARD_WIDTH;
    const leftZone = imageWidth / 3;
    const rightZone = (imageWidth / 3) * 2;

    if (locationX < leftZone) {
      const currentQuarter = Math.floor((position / duration) * 4);
      if (currentQuarter <= 0 && onNavigateToPrevious) onNavigateToPrevious();
      else playQuarter(audio, 'previous');
    } else if (locationX > rightZone) {
      const currentQuarter = Math.floor((position / duration) * 4);
      if (currentQuarter >= 3 && onNavigateToNext) onNavigateToNext();
      else playQuarter(audio, 'next');
    } else playPauseAudio();
  };

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      style={{
        width: CARD_WIDTH,
        marginHorizontal: 8,
      }}
      entering={FadeIn.duration(300)}>
      <Pressable
        onPress={handleImagePress}
        style={{ position: 'absolute', top: '60%', transform: [{ translateY: '-100%' }] }}>
        <AnimatedImage
          source={{ uri: audio.cover_url }}
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: 10,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={300}
          placeholder={{ uri: audio.cover_url }}
        />
      </Pressable>
      <View className="mt-4 items-center" style={{ position: 'absolute', top: '70%' }}>
        <Text className="text-xl font-bold text-white">{audio.title}</Text>
        <Text className="text-sm text-gray-300">
          {audio.posted_by_user?.username || 'Unknown Artist'}
        </Text>
      </View>
    </Animated.View>
  );
}

export default memo(AudioCard);
