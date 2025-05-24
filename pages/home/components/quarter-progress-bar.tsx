import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useAudioPlayer } from '~/store/useAudioPlayer';

type QuarterProgressBarProps = {
  height?: number;
};

const QuarterProgressBar = ({ height = 4 }: QuarterProgressBarProps) => {
  const { position, duration, currentAudio } = useAudioPlayer();

  // Calculate progress (0-1)
  const progress = duration > 0 ? position / duration : 0;

  // Calculate which quarter we're in and the progress within that quarter
  const currentQuarter = Math.min(Math.floor(progress * 4), 3);
  const quarterProgress = progress * 4 - currentQuarter;

  // Generate animated styles for each quarter
  const quarterStyles = [
    useAnimatedStyle(() => {
      if (currentQuarter < 0) return { width: '0%' };
      if (currentQuarter > 0) return { width: '100%' };
      return { width: withTiming(`${quarterProgress * 100}%`, { duration: 200 }) };
    }),
    useAnimatedStyle(() => {
      if (currentQuarter < 1) return { width: '0%' };
      if (currentQuarter > 1) return { width: '100%' };
      return { width: withTiming(`${quarterProgress * 100}%`, { duration: 200 }) };
    }),
    useAnimatedStyle(() => {
      if (currentQuarter < 2) return { width: '0%' };
      if (currentQuarter > 2) return { width: '100%' };
      return { width: withTiming(`${quarterProgress * 100}%`, { duration: 200 }) };
    }),
    useAnimatedStyle(() => {
      if (currentQuarter < 3) return { width: '0%' };
      if (currentQuarter > 3) return { width: '100%' };
      return { width: withTiming(`${quarterProgress * 100}%`, { duration: 200 }) };
    }),
  ];

  // If no audio is playing, show empty bars
  if (!currentAudio) {
    return (
      <View className="w-full flex-row justify-between gap-2">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <View
              key={`quarter-${index}`}
              className="flex-1 overflow-hidden rounded-full bg-card"
              style={{ height }}
            />
          ))}
      </View>
    );
  }

  // Calculate circle indicator size (same as height)
  const circleSize = height;

  return (
    <View className="w-full flex-row justify-between gap-2">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <View
            key={`quarter-${index}`}
            className="flex-1 overflow-hidden rounded-full bg-card"
            style={{ height }}>
            {/* Circle indicator at the start of each quarter */}
            <View
              className="absolute left-0 top-0 z-10 aspect-square rounded-full bg-white"
              style={{
                height,
                opacity: currentQuarter >= index ? 1 : 0,
              }}
            />

            {/* Fill bar - start after the circle */}
            <Animated.View
              className="h-full rounded-r-full bg-white"
              style={[
                {
                  position: 'absolute',
                  left: circleSize - 1,
                  top: 0,
                },
                quarterStyles[index],
                // Adjust style when quarter is complete
                currentQuarter > index ? { left: 0, width: '100%' } : null,
              ]}
            />
          </View>
        ))}
    </View>
  );
};

export default QuarterProgressBar;
