import { Image } from 'expo-image';
import { Dimensions, Pressable, View } from 'react-native';

import { Text } from './ui/text';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio as AudioType } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
  onNavigateToNext?: () => void;
  onNavigateToPrevious?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function AudioCard({ audio, onNavigateToNext, onNavigateToPrevious }: AudioProps) {
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
    <View className="relative" style={{ width: CARD_WIDTH, marginHorizontal: 8 }}>
      <View className="absolute left-0 right-0 top-16">
        <View className="items-center p-4">
          <Text className="text-xl font-bold text-white">{audio.title}</Text>
          <Text className="text-sm text-gray-300">
            {audio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </View>
        <Pressable onPress={handleImagePress}>
          <Image
            source={{ uri: audio.cover_url }}
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'red',
            }}
            contentFit="cover"
          />
        </Pressable>
      </View>
    </View>
  );
}
