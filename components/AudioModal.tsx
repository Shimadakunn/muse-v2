import { Image } from 'expo-image';
import { ArrowLeft, Heart, Pause, Play } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import Drawer from '~/components/ui/drawer';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';
import { formatAudioTime } from '~/utils/formatAudioTime';

export default function AudioModal({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}) {
  const { currentAudio, audioPlayer, playPauseAudio, isTransitioning, position, duration } =
    useAudioPlayer();
  const { like } = useSwipeStore();

  const progress = duration > 0 ? position / duration : 0;

  // Animate the progress bar
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress * 100}%`, { duration: 100 }),
    };
  });

  if (!currentAudio) return null;

  return (
    <Drawer
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      //   height={Dimensions.get('window').height}
      isBlack>
      <View className="flex-1 bg-background p-6">
        {/* Header with back button */}
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity onPress={() => setIsVisible(false)} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Now Playing</Text>
        </View>

        {/* Cover Image */}
        <View className="mb-8 items-center">
          <Image
            source={{ uri: currentAudio.cover_url }}
            style={{ height: 280, width: 280, borderRadius: 20 }}
            className="shadow-lg"
          />
        </View>

        {/* Title and Artist */}
        <View className="mb-8">
          <Text className="mb-1 text-2xl font-bold text-white">{currentAudio.title}</Text>
          <Text className="text-base text-gray-400">
            {currentAudio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-4 h-2 flex-row overflow-hidden rounded-full bg-foreground/20">
          <Animated.View className="h-full rounded-full bg-white" style={progressStyle} />
        </View>

        {/* Time indicators */}
        <View className="mb-8 flex-row justify-between">
          <Text className="text-gray-400">{formatAudioTime(position)}</Text>
          <Text className="text-gray-400">{formatAudioTime(duration)}</Text>
        </View>

        {/* Controls */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => like(currentAudio)}
            className="h-12 w-12 items-center justify-center">
            <Heart size={28} color="white" fill={currentAudio.liked ? 'red' : 'none'} />
          </TouchableOpacity>
          {audioPlayer && (
            <TouchableOpacity
              onPress={playPauseAudio}
              className="h-16 w-16 items-center justify-center rounded-full bg-white">
              {audioPlayer.playing || isTransitioning ? (
                <Pause size={32} color="#000" />
              ) : (
                <Play size={32} color="#000" />
              )}
            </TouchableOpacity>
          )}
          <View className="h-12 w-12" />
        </View>
      </View>
    </Drawer>
  );
}
