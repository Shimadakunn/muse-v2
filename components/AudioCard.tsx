import { View } from 'react-native';

import Cover from './ui/cover';
import { Text } from './ui/text';

import { Audio as AudioType } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
}

export default function AudioCard({ audio }: AudioProps) {
  return (
    <View className="mx-4 flex aspect-square w-[80vw] overflow-hidden border border-red-500">
      <View className="mb-2 items-center">
        <Text className="text-xl font-bold text-white">{audio.title}</Text>
        <Text className="text-sm text-gray-300">
          {audio.posted_by_user?.username || 'Unknown Artist'}
        </Text>
      </View>
      <View className="flex flex-1 items-center justify-center">
        <Cover coverUrl={audio.cover_url} className="aspect-square h-full max-h-full rounded-lg" />
      </View>
    </View>
  );
}
