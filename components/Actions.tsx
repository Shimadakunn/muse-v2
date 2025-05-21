import { ChartBar, Heart } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { Audio, useSwipeStore } from '~/store/useSwipe';

export default function Actions({ audio }: { audio: Audio }) {
  const { like } = useSwipeStore();
  return (
    <View className="flex-row justify-between">
      <TouchableOpacity>
        <ChartBar size={24} color="white" fill="none" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => like(audio)}>
        <Heart size={24} color="white" fill={audio.liked ? 'red' : 'none'} />
      </TouchableOpacity>
    </View>
  );
}
