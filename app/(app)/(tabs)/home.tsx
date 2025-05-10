import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AudioCard from '~/components/AudioCard';
import { Text } from '~/components/ui/text';
import { Audio, useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, swipeUp, swipeDown } = useSwipeStore();
  const flatListRef = useRef<FlatList<Audio>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 16;

  // Track index changes to detect direction of navigation
  useEffect(() => {
    if (currentIndex !== previousIndex) {
      if (currentIndex < previousIndex) {
        console.log('Scrolled down to previous item, triggering cancelLastSwipe');
        swipeDown(audios[currentIndex]);
      } else if (currentIndex > previousIndex) {
        console.log('Scrolled up to next item, triggering swipeUp', audios[previousIndex]?.title);
        swipeUp(audios[previousIndex]);
      }

      setPreviousIndex(currentIndex);
    }
  }, [currentIndex]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);

    console.log('Scroll ended at index:', newIndex, 'Previous index:', currentIndex);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
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
            <AudioCard audio={audio} />
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
