import { useCallback, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Actions from './actions';
import AudioCard from './components/card';

import { Text } from '~/components/ui/text';
import { Audio } from '~/store/useSwipe';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 8;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_SPACE_WIDTH = (width - CARD_WIDTH) / 2;
const VISIBLE_ITEMS = 3; // Number of items to keep rendered at once for performance

type ItemProps = {
  item: Audio;
  index: number;
  scrollX: Animated.SharedValue<number>;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
};

// Separate component to properly use animation hooks
function AnimatedCard({ item, index, scrollX, onNavigateNext, onNavigatePrevious }: ItemProps) {
  const scale = useDerivedValue(() => {
    const distance = Math.abs((scrollX.value - index * ITEM_WIDTH) / ITEM_WIDTH);
    return withTiming(distance > 0.5 ? 0.9 : 1, { duration: 200 });
  });

  const opacity = useDerivedValue(() => {
    const distance = Math.abs((scrollX.value - index * ITEM_WIDTH) / ITEM_WIDTH);
    return withTiming(distance > 1 ? 0.7 : 1, { duration: 200 });
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={cardStyle}>
      <AudioCard
        audio={item}
        onNavigateToNext={onNavigateNext}
        onNavigateToPrevious={onNavigatePrevious}
      />
    </Animated.View>
  );
}

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
  const isScrolling = useSharedValue(false);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / ITEM_WIDTH);
      isScrolling.value = false;
      if (onSwipeEnd) {
        runOnJS(setCurrentIndex)(newIndex);
        runOnJS(onSwipeEnd)(newIndex);
      }
    },
  });

  const navigateToNext = useCallback(() => {
    if (currentIndex < audios.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      if (onSwipeEnd) onSwipeEnd(nextIndex);
    }
  }, [currentIndex, audios.length, onSwipeEnd]);

  const navigateToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
      if (onSwipeEnd) onSwipeEnd(prevIndex);
    }
  }, [currentIndex, onSwipeEnd]);

  const renderItem = useCallback(
    ({ item, index }: { item: Audio; index: number }) => {
      return (
        <AnimatedCard
          item={item}
          index={index}
          scrollX={scrollX}
          onNavigateNext={navigateToNext}
          onNavigatePrevious={navigateToPrevious}
        />
      );
    },
    [navigateToNext, navigateToPrevious, scrollX]
  );

  const getItemLayout = useCallback(
    (data: unknown, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Audio) => item.id, []);

  // Only render items that are close to the current index
  const windowSize = 5; // FlatList windowSize for better performance

  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
      <Animated.FlatList
        ref={flatListRef}
        data={audios}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
        getItemLayout={getItemLayout}
        windowSize={windowSize}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        initialNumToRender={VISIBLE_ITEMS}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
      <View className="absolute bottom-[100%] left-0 right-0 h-1/2">
        <Text>{audios[currentIndex].title}</Text>
      </View>
      <Actions audios={audios} currentIndex={currentIndex} />
    </GestureHandlerRootView>
  );
}
