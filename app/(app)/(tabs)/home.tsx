import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AudioCard from '~/components/AudioCard';
import { Text } from '~/components/ui/text';
import { useSwipeStore } from '~/store/useSwipe';

export default function Home() {
  const { audios, getAudios, swipeRight, swipeUp } = useSwipeStore();

  useEffect(() => {
    getAudios();
  }, []);

  // if (audios.length === 0) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#fff" />
  //     </View>
  //   );
  // }

  if (audios.length === 0) {
    return (
      <View style={styles.container}>
        <Text className="text-center text-xl">No more audios available</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Check back later for new tunes!
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.cardsContainer}>
        {audios.map((audio, index) => (
          <View
            key={`audio-${audio.id}-${index}`}
            style={[styles.cardWrapper, { zIndex: audios.length - index }]}>
            <AudioCard
              audio={audio}
              onSwipeLeft={(audio) => swipeUp(audio)}
              onSwipeRight={(audio) => swipeRight(audio)}
            />
          </View>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
