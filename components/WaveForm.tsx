import { useEffect } from 'react';
import { View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  waveForms: number[];
  onSeek: (progress: number) => void;
  duration: number;
  progress: number;
}

export default function AudioWaveformScrubber({ waveForms, onSeek, duration, progress }: Props) {
  const panX = useSharedValue(-progress);

  useEffect(() => {
    panX.value = withTiming(-progress);
  }, [progress]);

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      // Clamp and convert panX to progress
      const newPan = Math.max(Math.min(event.translationX, 0), -duration);
      panX.value = newPan;
      onSeek(-newPan);
    },
  });

  const maskAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: panX.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[{ width: '100%', height: 60, overflow: 'hidden' }, maskAnimatedStyle]}>
        {/* Render your waveform here, e.g. as bars */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
          {waveForms.map((v, i) => (
            <View
              key={i}
              style={{
                width: 2,
                height: `${v * 100}%`,
                backgroundColor: '#FF5836',
                marginHorizontal: 1,
                borderRadius: 1,
              }}
            />
          ))}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
