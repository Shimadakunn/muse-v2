import { memo } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { useAudioPlayer } from '~/store/useAudioPlayer';

const QuarterSegment = memo(({ quarter, progress }: { quarter: number; progress: number }) => {
  const quarterStart = quarter / 4;
  const quarterEnd = (quarter + 1) / 4;
  const isFilling = progress > quarterStart && progress < quarterEnd;
  const isComplete = progress >= quarterEnd;

  const width = useDerivedValue(() => {
    if (isComplete) {
      return withTiming('100%', { duration: 300 });
    } else if (isFilling) {
      return withTiming(`${((progress - quarterStart) / 0.25) * 100}%`, { duration: 50 });
    }
    return '0%';
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View
      key={`quarter-${quarter}`}
      className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/30">
      <Animated.View className="h-full bg-white" style={animatedStyle} />
    </View>
  );
});

function ProgressBar() {
  const { position, duration } = useAudioPlayer();
  const progress = duration > 0 ? position / duration : 0;

  return (
    <View className="flex-row gap-2">
      {[0, 1, 2, 3].map((quarter) => (
        <QuarterSegment key={quarter} quarter={quarter} progress={progress} />
      ))}
    </View>
  );
}

export default memo(ProgressBar);
