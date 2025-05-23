import { useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import AudioCard from './AudioCard';

import { Audio } from '~/store/useSwipe';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 8;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_SPACE_WIDTH = (width - CARD_WIDTH) / 2;

export default function SwipeableAudioCards({
  audios,
  onSwipeEnd,
}: {
  audios: Audio[];
  onSwipeEnd: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / ITEM_WIDTH);
      if (onSwipeEnd) {
        runOnJS(setCurrentIndex)(newIndex);
        runOnJS(onSwipeEnd)(newIndex);
      }
    },
  });

  const navigateToNext = () => {
    if (currentIndex < audios.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      if (onSwipeEnd) onSwipeEnd(nextIndex);
    }
  };

  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
      if (onSwipeEnd) onSwipeEnd(prevIndex);
    }
  };

  const renderItem = ({ item }: { item: Audio }) => {
    return (
      <AudioCard
        audio={item}
        onNavigateToNext={navigateToNext}
        onNavigateToPrevious={navigateToPrevious}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
      <Animated.FlatList
        ref={flatListRef}
        data={audios}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialScrollIndex={currentIndex}
        contentContainerStyle={{ paddingHorizontal: EMPTY_SPACE_WIDTH }}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
    </GestureHandlerRootView>
  );
}
