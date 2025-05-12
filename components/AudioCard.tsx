import { Heart, Pause, Play } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { Avatar } from './ui';
import WaveformSlider from './ui/WaveformSlider';
import Cover from './ui/cover';
import { Text } from './ui/text';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio as AudioType, useSwipeStore } from '~/store/useSwipe';

interface AudioProps {
  audio: AudioType;
}

export default function AudioCard({ audio }: AudioProps) {
  const {
    isPlaying,
    duration,
    position,
    pauseAudio,
    resumeAudio,
    seekAudio,
    playAudio,
    currentAudio,
  } = useAudioPlayer();
  const { like } = useSwipeStore();

  // Check if this audio is the currently playing one
  const isCurrentAudio = currentAudio?.id === audio.id;

  const handlePlayPause = () => {
    if (isCurrentAudio) {
      // If this is the current audio, just toggle play/pause
      isPlaying ? pauseAudio() : resumeAudio();
    } else {
      // If this is a different audio, play it
      playAudio(audio);
    }
  };

  const handleSeek = (newPosition: number) => {
    if (seekAudio) {
      seekAudio(newPosition);
    }
  };

  return (
    <View className="flex h-[75vh] w-full rounded-2xl border border-foreground/50 bg-card">
      {/* Cover */}
      <View className="">
        <Cover
          coverUrl={audio.cover_url}
          className="mx-auto aspect-square w-full rounded-2xl p-6"
        />
      </View>

      {/* Title and artist */}
      <View className="mt-4 flex-row items-center justify-between px-6">
        <View className="flex-col items-start">
          <Text className="text-2xl font-bold text-foreground">{audio.title}</Text>
          <View className="mt-2 flex-row items-center">
            <Avatar avatarUrl={audio.posted_by_user.avatar_url} size={24} />
            <Text className="ml-2 text-sm font-medium text-foreground/80">
              {audio.posted_by_user?.username || 'Unknown Artist'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            like(audio);
          }}>
          <Heart
            size={24}
            color={audio.liked ? 'red' : 'white'}
            fill={audio.liked ? 'red' : 'none'}
          />
        </TouchableOpacity>
      </View>

      {/* Waveform slider */}
      <WaveformSlider
        duration={duration || 0}
        position={position || 0}
        isPlaying={isPlaying && isCurrentAudio}
        onSeek={handleSeek}
      />

      {/* Play/Pause button */}
      <View className="mb-6 mt-2 flex-row items-center justify-center">
        <TouchableOpacity className="rounded-full bg-accent/50 p-3" onPress={handlePlayPause}>
          {isPlaying && isCurrentAudio ? (
            <Pause size={32} color="white" />
          ) : (
            <Play size={32} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
