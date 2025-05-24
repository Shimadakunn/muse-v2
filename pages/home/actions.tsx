import { memo } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import ProgressBar from './components/quarter-progress-bar';

import { Text } from '~/components/ui/text';
import { Audio } from '~/store/useSwipe';

function Actions({ audios, currentIndex }: { audios: Audio[]; currentIndex: number }) {
  if (!audios || audios.length === 0) return null;

  return (
    <Animated.View
      className="absolute bottom-[20%] left-16 right-16"
      entering={FadeIn.duration(300)}>
      <View style={{ borderWidth: 1, borderColor: 'red', height: 12 }}>
        <ProgressBar />
      </View>
      <Text className="mt-2 text-center text-white">{audios[currentIndex]?.title || ''}</Text>
    </Animated.View>
  );
}

export default memo(Actions);
