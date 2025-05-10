import { Dimensions } from 'react-native';

import Audio from '~/components/AudioCard';
import { Audio as AudioType } from '~/store/useSwipe';

interface AudioSwipeProps {
  audio: AudioType;
  onSwipeUp: (audio: AudioType) => void;
  onSwipeRight: (audio: AudioType) => void;
  onSwipeDown: (audio: AudioType) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_UP_THRESHOLD = SCREEN_HEIGHT * 0.15;
const SWIPE_DOWN_THRESHOLD = SCREEN_HEIGHT * 0.15;

export default function AudioSwipe({
  audio,
  onSwipeUp,
  onSwipeRight,
  onSwipeDown,
}: AudioSwipeProps) {
  // const translateX = useSharedValue(0);
  // const translateY = useSharedValue(0);
  // const cardOpacity = useSharedValue(1);
  // const cardScale = useSharedValue(1);

  // const gesture = Gesture.Pan()
  //   .onUpdate((e) => {
  //     // Horizontal movement (right swipe)
  //     translateX.value = e.translationX;

  //     // Vertical movement (up swipe or down swipe)
  //     translateY.value = e.translationY;

  //     // Scale and opacity based on swipe distance
  //     if (e.translationX > 0) {
  //       // Right swipe: Scale up slightly
  //       cardScale.value = interpolate(e.translationX, [0, SCREEN_WIDTH], [1, 1.05]);
  //     } else if (e.translationY < 0) {
  //       // Up swipe: Fade out
  //       cardOpacity.value = interpolate(-e.translationY, [0, SCREEN_HEIGHT * 0.5], [1, 0.7]);
  //     } else if (e.translationY > 0) {
  //       // Down swipe: Different visual feedback
  //       cardScale.value = interpolate(e.translationY, [0, SCREEN_HEIGHT * 0.5], [1, 0.95]);
  //       cardOpacity.value = interpolate(e.translationY, [0, SCREEN_HEIGHT * 0.5], [1, 0.8]);
  //     }
  //   })
  //   .onEnd((e) => {
  //     if (translateX.value > SWIPE_THRESHOLD) {
  //       // Swipe right animation
  //       translateX.value = withTiming(SCREEN_WIDTH, {
  //         duration: 300,
  //         easing: Easing.out(Easing.ease),
  //       });
  //       cardScale.value = withTiming(1.1, { duration: 250 });
  //       cardOpacity.value = withTiming(0, { duration: 250 }, () => {
  //         runOnJS(onSwipeRight)(audio);
  //       });
  //     } else if (translateY.value < -SWIPE_UP_THRESHOLD) {
  //       // Swipe up animation
  //       translateY.value = withTiming(-SCREEN_HEIGHT, {
  //         duration: 300,
  //         easing: Easing.out(Easing.ease),
  //       });
  //       cardOpacity.value = withTiming(0, { duration: 250 }, () => {
  //         runOnJS(onSwipeUp)(audio);
  //       });
  //     } else if (translateY.value > SWIPE_DOWN_THRESHOLD) {
  //       // Swipe down animation - undo last action
  //       translateY.value = withTiming(SCREEN_HEIGHT, {
  //         duration: 300,
  //         easing: Easing.out(Easing.ease),
  //       });
  //       cardScale.value = withTiming(0.9, { duration: 250 });
  //       cardOpacity.value = withTiming(0, { duration: 250 }, () => {
  //         runOnJS(onSwipeDown)(audio);
  //       });
  //     } else {
  //       // Reset position, scale and opacity
  //       translateX.value = withSpring(0, { damping: 15 });
  //       translateY.value = withSpring(0, { damping: 15 });
  //       cardScale.value = withSpring(1, { damping: 15 });
  //       cardOpacity.value = withSpring(1, { damping: 15 });
  //     }
  //   });

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { translateX: translateX.value },
  //       { translateY: translateY.value },
  //       { scale: cardScale.value },
  //     ],
  //     opacity: cardOpacity.value,
  //   };
  // });

  return (
    // <GestureDetector gesture={gesture}>
    //   <Animated.View style={[animatedStyle]} className="w-full">
    <Audio audio={audio} />
    // </Animated.View>
    // </GestureDetector>
  );
}
