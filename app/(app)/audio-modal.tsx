import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Back, Text } from '~/components/ui';
import { useAudioPlayer } from '~/store/useAudioPlayer';

// Format seconds to MM:SS
function formatTime(seconds: number | undefined): string {
  if (seconds === undefined) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function AudioModal() {
  const { currentAudio: audio, audioPlayer } = useAudioPlayer();
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(audioPlayer?.duration || 100);

  // Update progress as audio plays
  useEffect(() => {
    if (!audioPlayer) return;

    const interval = setInterval(() => {
      if (audioPlayer.currentTime !== undefined) {
        progress.value = audioPlayer.currentTime;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [audioPlayer, progress]);

  // Update max value when duration changes
  useEffect(() => {
    if (audioPlayer?.duration) {
      max.value = audioPlayer.duration;
    }
  }, [audioPlayer?.duration, max]);

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
    <SafeAreaView className="mx-4 flex-1 items-center justify-start bg-background p-4 pt-12">
      <View className="absolute left-1/2 top-6 h-1 w-16 -translate-x-1/2 rounded-full bg-foreground/30" />

      <Image
        source={{ uri: audio.cover_url }}
        style={{
          width: '100%',
          aspectRatio: 1,
          borderRadius: 10,
          borderWidth: 1,
        }}
      />
      <View className="w-full flex-row items-center justify-between">
        <View className="">
          <Text className="text-2xl font-bold text-foreground">{audio.title}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-foreground/50">{audio.posted_by_user.username}</Text>
            <Image
              source={{ uri: audio.posted_by_user.avatar_url }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
        <View className="">
          <Heart size={20} color="red" />
        </View>
      </View>
      <View className="w-full items-center justify-center ">
        <Slider
          style={{ width: '100%', height: 40 }}
          theme={{
            minimumTrackTintColor: '#3B82F6',
            maximumTrackTintColor: '#E5E7EB',
            bubbleBackgroundColor: '#3B82F6',
            disableMinTrackTintColor: '#E5E7EB',
            cacheTrackTintColor: '#3B82F6',
            heartbeatColor: '#3B82F6',
            bubbleTextColor: '#FFFFFF',
          }}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          onSlidingComplete={(value) => audioPlayer?.seekTo(value)}
          containerStyle={{ marginVertical: 16 }}
          bubble={(value) => formatTime(value)}
          renderBubble={() => null}
        />
        <Text className="text-sm text-foreground/50">
          {formatTime(audioPlayer?.currentTime)} / {formatTime(audioPlayer?.duration)}
        </Text>
      </View>
    </SafeAreaView>
  );
}
