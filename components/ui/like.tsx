import { Heart } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useSwipeStore } from '~/store/useSwipe';

export default function Like() {
  const { currentAudio } = useAudioPlayer();
  const { like } = useSwipeStore();
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation(); // Prevent triggering parent's onPress
        if (currentAudio) like(currentAudio);
      }}>
      <Heart size={22} color="white" fill={currentAudio?.liked ? 'red' : 'none'} />
    </Pressable>
  );
}
