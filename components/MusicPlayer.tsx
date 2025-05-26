import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Heart, Pause, Play } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

const MusicPlayer = () => {
  const { currentAudio, audioPlayer, playPauseAudio, isTransitioning, position, duration } =
    useAudioPlayer();
  const { like } = useSwipeStore();

  const progress = duration > 0 ? position / duration : 0;

  const handleOpenModal = () => {
    if (!currentAudio) return;
    router.push({
      pathname: '/(app)/audio-modal',
      params: { id: currentAudio.id },
    });
  };

  // Animate the progress bar to prevent resets during transitions
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress * 100}%`, { duration: 100 }),
    };
  });

  if (!currentAudio) return null;
  return (
    <TouchableOpacity
      className="relative mx-2 flex-row items-center overflow-hidden rounded-3xl border border-foreground/50 bg-card p-3"
      onPress={handleOpenModal}
      activeOpacity={0.7}>
      {/* COVER & TITLE */}
      <View className="flex-1 flex-row items-center gap-2">
        <Animated.View key={currentAudio.id} entering={FadeIn.duration(300)}>
          <Image
            source={{ uri: currentAudio.cover_url }}
            style={{ height: 40, width: 40, borderRadius: 10 }}
          />
        </Animated.View>

        {/* Title and artist */}
        <Animated.View
          className="flex-1"
          key={`title-${currentAudio.id}`}
          entering={FadeIn.duration(300)}>
          <Text className="truncate font-medium text-white">{currentAudio.title}</Text>
          <Text className="truncate text-xs text-gray-400">
            {currentAudio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </Animated.View>
      </View>

      {/* LIKE */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering parent's onPress
          like(currentAudio);
        }}>
        <Heart size={22} color="white" fill={currentAudio.liked ? 'red' : 'none'} />
      </Pressable>

      {/* PLAY PAUSE */}
      {audioPlayer ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            playPauseAudio();
          }}
          className="h-10 w-10 items-center justify-center">
          {audioPlayer.playing || isTransitioning ? (
            <Pause size={24} color="white" fill="white" />
          ) : (
            <Play size={24} color="white" fill="white" />
          )}
        </Pressable>
      ) : (
        <ActivityIndicator color="white" size="small" />
      )}

      {/* PROGRESS BAR */}
      <View
        className="absolute bottom-0 left-0 right-0 mx-3 h-1 flex-row overflow-hidden"
        style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Animated.View className="h-full rounded-full bg-white" style={progressStyle} />
        <View className="h-full flex-1 bg-foreground/20" />
      </View>
    </TouchableOpacity>
  );
};

export default MusicPlayer;
