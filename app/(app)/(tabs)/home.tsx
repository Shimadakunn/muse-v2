import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Actions from '~/components/Actions';
import AudioCard from '~/components/AudioCard';
import ProgressBar from '~/components/ProgressBar';
import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio, useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, swipeUp, getAudios } = useSwipeStore();
  const { playAudio, position, duration } = useAudioPlayer();
  const flatListRef = useRef<FlatList<Audio>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isLikeScroll, setIsLikeScroll] = useState(false);

  // Use full screen width for each item
  const ITEM_WIDTH = Dimensions.get('window').width;

  useEffect(() => {
    if (currentIndex !== previousIndex) {
      // if (currentIndex < previousIndex) swipeDown(audios[currentIndex]);
      if (currentIndex > previousIndex && !isLikeScroll) swipeUp(audios[previousIndex], false);

      if (audios[currentIndex]) playAudio(audios[currentIndex]);

      setPreviousIndex(currentIndex);

      if (isLikeScroll) setIsLikeScroll(false);
    }
  }, [currentIndex, isLikeScroll]);

  // Play the initial audio when component mounts
  useEffect(() => {
    getAudios();
    if (audios.length > 0 && currentIndex === 0) playAudio(audios[0]);
  }, []);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / ITEM_WIDTH);

    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
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
    <GestureHandlerRootView className="relative flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={audios}
        keyExtractor={(item, index) => `audio-${item.id}-${index}`}
        renderItem={({ item: audio }) => <AudioCard audio={audio} />}
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToAlignment="center"
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        className="h-[30vh] border border-red-500"
      />
      <View className="absolute bottom-[10vh] left-0 right-0 border border-blue-500">
        <ProgressBar />
        <Actions />
      </View>
    </GestureHandlerRootView>
  );
}
