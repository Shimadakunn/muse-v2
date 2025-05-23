import { memo } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import ProgressBar from './components/quarter-progress-bar';

import { Text } from '~/components/ui/text';
import { Audio } from '~/store/useSwipe';

function Actions({ audios, currentIndex }: { audios: Audio[]; currentIndex: number }) {
  return (
    <Animated.View
      className="absolute bottom-[20%] left-16 right-16"
      entering={FadeIn.duration(300)}>
      <ProgressBar />
      <Text className="mt-2 text-center text-white">{audios[currentIndex]?.title || ''}</Text>
    </Animated.View>
  );
}

export default memo(Actions);
