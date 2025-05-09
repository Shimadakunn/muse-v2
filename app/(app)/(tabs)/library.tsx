import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import AudioModal from '~/components/AudioModal';
import Cover from '~/components/ui/cover';
import { Text } from '~/components/ui/text';
import { useLibraryStore } from '~/store/useLibrary';
import { Audio } from '~/store/useSwipe';

export default function Library() {
  const { library, getLibrary } = useLibraryStore();
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load library when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getLibrary();
    }, [])
  );

  const openAudioModal = (audio: Audio) => {
    setSelectedAudio(audio);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!library || library.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text className="text-center text-xl">Your library is empty</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Swipe right on songs you like to add them here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>

      <FlatList
        data={library}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.audioItem} onPress={() => openAudioModal(item)}>
            <Cover coverUrl={item.cover_url} size={150} />
            <Text style={styles.audioTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContainer}
      />

      <AudioModal audio={selectedAudio} visible={modalVisible} onClose={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  audioItem: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  audioTitle: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
