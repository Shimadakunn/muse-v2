import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AudioCard from '~/components/AudioCard';
import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio, useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, swipeUp, swipeDown } = useSwipeStore();
  const { playAudio } = useAudioPlayer();
  const flatListRef = useRef<FlatList<Audio>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isLikeScroll, setIsLikeScroll] = useState(false);

  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 16;

  useEffect(() => {
    if (currentIndex !== previousIndex) {
      if (currentIndex < previousIndex) swipeDown(audios[currentIndex]);
      else if (currentIndex > previousIndex && !isLikeScroll) swipeUp(audios[previousIndex], false);

      if (audios[currentIndex]) playAudio(audios[currentIndex]);

      setPreviousIndex(currentIndex);

      if (isLikeScroll) setIsLikeScroll(false);
    }
  }, [currentIndex, isLikeScroll]);

  // Play the initial audio when component mounts
  useEffect(() => {
    if (audios.length > 0 && currentIndex === 0) playAudio(audios[0]);
  }, []);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  const scrollToNextItem = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < audios.length) {
      swipeUp(audios[currentIndex], true);
      setIsLikeScroll(true);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  if (audios.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-xl">No more audios available</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Check back later for new tunes!
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <FlatList
        ref={flatListRef}
        data={audios}
        keyExtractor={(item, index) => `audio-${item.id}-${index}`}
        renderItem={({ item: audio }) => (
          <View className="m-2">
            <AudioCard audio={audio} onLike={scrollToNextItem} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        pagingEnabled
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
    </GestureHandlerRootView>
  );
}
