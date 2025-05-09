import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import Cover from './ui/cover';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio } from '~/store/useSwipe';

interface AudioCardProps {
  audio: Audio;
  onSwipeLeft: (audio: Audio) => void;
  onSwipeRight: (audio: Audio) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function AudioCard({ audio, onSwipeLeft, onSwipeRight }: AudioCardProps) {
  const { playAudio, pauseAudio, isPlaying, currentAudio, position, duration } = useAudioPlayer();
  const translateX = useSharedValue(0);
  const [isPlaying_local, setIsPlaying_local] = useState(false);

  const isCurrentlyPlaying = isPlaying && currentAudio?.id === audio.id;

  const togglePlay = () => {
    if (isCurrentlyPlaying) {
      pauseAudio();
    } else {
      playAudio(audio);
    }
  };

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Format duration to mm:ss
  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <Cover coverUrl={audio.cover_url} size={200} />
          <Text style={styles.title}>{audio.title}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {isCurrentlyPlaying ? formatTime(position) : '00:00'}
              </Text>
              <Text style={styles.timeText}>
                {isCurrentlyPlaying ? formatTime(duration) : '00:00'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
            <Ionicons name={isCurrentlyPlaying ? 'pause' : 'play'} size={32} color="white" />
          </TouchableOpacity>

          <View style={styles.swipeHint}>
            <Ionicons name="chevron-back" size={24} color="#aaa" />
            <Text style={styles.swipeText}>Swipe to skip / like</Text>
            <Ionicons name="chevron-forward" size={24} color="#aaa" />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.9,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  swipeText: {
    color: '#aaa',
    marginHorizontal: 5,
  },
});
