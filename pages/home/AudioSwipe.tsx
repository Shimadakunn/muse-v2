import { Animated } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, withSpring } from 'react-native-reanimated';

import AudioCard from '~/components/AudioSwipe';
import { Audio as AudioType } from '~/store/useSwipe';

interface AudioCardProps {
  audio: AudioType;
  onSwipeUp: (audio: AudioType) => void;
  onSwipeRight: (audio: AudioType) => void;
}

export default function AudioSwipe({ audio, onSwipeUp, onSwipeRight }: AudioCardProps) {
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH);
        runOnJS(onSwipeRight)(audio);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onSwipeLeft)(audio);
      } else {
        translateX.value = withSpring(0);
      }
    });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <AudioCard audio={audio} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />
      </Animated.View>
    </GestureDetector>
  );
}
