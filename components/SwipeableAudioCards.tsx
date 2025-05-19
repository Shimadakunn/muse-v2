import { useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import AudioCard from './AudioCard';
import ProgressBar from './ProgressBar';

import { Audio } from '~/store/useSwipe';

interface SwipeableAudioCardsProps {
  audios: Audio[];
  onSwipeEnd?: (index: number) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 8;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_SPACE_WIDTH = (width - CARD_WIDTH) / 2;

export default function SwipeableAudioCards({ audios, onSwipeEnd }: SwipeableAudioCardsProps) {
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

  const snapToItem = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const renderItem = ({ item }: { item: Audio }) => {
    return <AudioCard audio={item} />;
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
      <View className="absolute bottom-[25%] left-20 right-20">
        <ProgressBar />
      </View>
    </GestureHandlerRootView>
  );
}
