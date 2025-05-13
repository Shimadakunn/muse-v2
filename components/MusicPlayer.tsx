import { router } from 'expo-router';
import { Heart, Pause, Play } from 'lucide-react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import Cover from './ui/cover';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

const MusicPlayer = () => {
  const { currentAudio, isPlaying, isLoading, duration, position, pauseAudio, resumeAudio } =
    useAudioPlayer();
  const { like } = useSwipeStore();

  if (!currentAudio) return null;

  const progress = duration > 0 ? position / duration : 0;

  const handleOpenModal = () => {
    router.push({
      pathname: '/(app)/audio-modal',
      params: { id: currentAudio.id },
    });
  };

  return (
    <TouchableOpacity
      className="relative mx-2 flex-row items-center overflow-hidden rounded-3xl border border-foreground/50 bg-card p-3"
      onPress={handleOpenModal}
      activeOpacity={0.7}>
      {/* COVER & TITLE */}
      <View className="flex-1 flex-row items-center gap-2">
        <Cover coverUrl={currentAudio.cover_url} className="h-10 w-10 rounded-xl" />

        {/* Title and artist */}
        <View className="flex-1">
          <Text className="truncate font-medium text-white">{currentAudio.title}</Text>
          <Text className="truncate text-xs text-gray-400">
            {currentAudio.posted_by_user?.username || 'Unknown Artist'}
          </Text>
        </View>
      </View>

      {/* LIKE */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering parent's onPress
          like(currentAudio);
        }}>
        <Heart size={22} color="white" fill={currentAudio.liked ? 'red' : 'none'} />
      </TouchableOpacity>

      {/* PLAY PAUSE */}
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            isPlaying ? pauseAudio() : resumeAudio();
          }}
          className="h-10 w-10 items-center justify-center">
          {isPlaying ? (
            <Pause size={24} color="white" fill="white" />
          ) : (
            <Play size={24} color="white" fill="white" />
          )}
        </TouchableOpacity>
      )}

      {/* PROGRESS BAR */}
      <View
        className="absolute bottom-0 left-0 right-0 mx-2 h-1 flex-row overflow-hidden"
        style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
        <View className="h-full flex-1 bg-foreground/20" />
      </View>
    </TouchableOpacity>
  );
};

export default MusicPlayer;
