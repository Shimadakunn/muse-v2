import { Pause, Play } from 'lucide-react-native';
import { ActivityIndicator, Pressable } from 'react-native';

import { useAudioPlayer } from '~/store/useAudioPlayer';

export default function PlayPause() {
  const { audioPlayer, playPauseAudio, isTransitioning } = useAudioPlayer();
  return audioPlayer ? (
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
  );
}
