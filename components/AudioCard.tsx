import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Avatar } from './ui';
import Cover from './ui/cover';
import { Text } from './ui/text';

import { Audio as AudioType } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
}

export default function AudioCard({ audio }: AudioProps) {
  return (
    <View className="relative h-[75vh] w-full rounded-2xl bg-red-500">
      {/* Header */}
      <View className="absolute left-4 right-4 top-4 flex-row items-center justify-between">
        <View className="flex-col items-start">
          <Text className="text-2xl font-bold text-foreground">{audio.title}</Text>
          <View className="mt-2 flex-row items-center">
            <Avatar avatarUrl={audio.posted_by_user.avatar_url} size={24} />
            <Text className="ml-2 text-sm font-medium text-foreground/80">
              {audio.posted_by_user?.username || 'Unknown Artist'}
            </Text>
          </View>
        </View>
        <View className="flex-col items-start">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Ionicons name="close" size={24} color="black" />
          </View>
        </View>
      </View>

      <View className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
        <Cover coverUrl={audio.cover_url} size={200} />
      </View>
    </View>
  );
}
