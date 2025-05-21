import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAudioPlayer } from '~/store/useAudioPlayer';

export default function ProgressBar() {
  const { position, duration } = useAudioPlayer();

  const progress = duration > 0 ? position / duration : 0;
  return (
    <View className="flex-row gap-2">
      {[0, 1, 2, 3].map((quarter) => {
        const quarterStart = quarter / 4;
        const quarterEnd = (quarter + 1) / 4;
        const isFilling = progress > quarterStart && progress < quarterEnd;
        const isComplete = progress >= quarterEnd;

        return (
          <View
            key={`quarter-${quarter}`}
            className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/30">
            {isComplete ? (
              <View className="h-full w-full bg-white" />
            ) : isFilling ? (
              <Animated.View
                className="h-full rounded-full bg-white"
                style={{
                  width: `${((progress - quarterStart) / 0.25 + 0.1) * 100}%`,
                }}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
