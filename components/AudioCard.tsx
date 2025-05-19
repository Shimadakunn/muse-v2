import { Image } from 'expo-image';
import { Dimensions, View } from 'react-native';

import { Text } from './ui/text';

import { Audio as AudioType } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // 90% of screen width

export default function AudioCard({ audio }: AudioProps) {
  return (
    <View className="relative" style={{ width: CARD_WIDTH, marginHorizontal: 8 }}>
      <View className="absolute left-0 right-0 top-16">
        <View className="items-center p-4">
          <Text className="text-xl font-bold text-white">{audio.title}</Text>
          <Text className="text-sm text-gray-300">
            {audio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </View>
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
      </View>
    </View>
  );
}
