import { router } from 'expo-router';
import { Heart, Pause, Play } from 'lucide-react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

const MusicPlayer = () => {
  const { currentAudio, isPlaying, isLoading, duration, position, pauseAudio, resumeAudio } =
    useAudioPlayer();
  const { like } = useSwipeStore();

  if (!currentAudio) return null;

  // Calculate progress percentage
  const progress = duration > 0 ? position / duration : 0;
  const size = 40; // Size of the circle (matching the TouchableOpacity)
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleOpenModal = () => {
    router.push({
      pathname: '/(app)/audio-modal',
      params: { id: currentAudio.id },
    });
  };

  return (
    <TouchableOpacity
      className="mx-2 flex-row items-center rounded-full border border-foreground/50 bg-card p-3"
      onPress={handleOpenModal}
      activeOpacity={0.7}>
      <View className="flex-1 flex-row items-center">
        <View className="relative h-10 w-10 items-center justify-center">
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#444444"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ffffff"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          </Svg>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Prevent triggering parent's onPress
                isPlaying ? pauseAudio() : resumeAudio();
              }}
              className="h-10 w-10 items-center justify-center rounded-full bg-accent/50">
              {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
            </TouchableOpacity>
          )}
        </View>

        {/* Title and artist */}
        <View className="ml-3 flex-1">
          <Text className="truncate font-medium text-white">{currentAudio.title}</Text>
          <Text className="truncate text-xs text-gray-400">
            {currentAudio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering parent's onPress
          like(currentAudio);
        }}>
        <Heart size={20} color="white" fill={currentAudio.liked ? 'red' : 'none'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MusicPlayer;
