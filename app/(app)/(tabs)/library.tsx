import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';

import AudioCard from '~/components/AudioCard';
import Cover from '~/components/ui/cover';
import { Text } from '~/components/ui/text';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useLibraryStore } from '~/store/useLibrary';
import { Audio } from '~/store/useSwipe';

export default function Library() {
  const { library, getLibrary } = useLibraryStore();
  const { playAudio } = useAudioPlayer();
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
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-center text-xl text-foreground">Your library is empty</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Swipe right on songs you like to add them here
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Text className="text-center text-xl text-foreground">Your Library</Text>

      <FlatList
        data={library}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="m-2" onPress={() => playAudio(item)}>
            <Cover coverUrl={item.cover_url} className="aspect-square w-[125px] rounded-2xl" />
            <Text className="mt-2 text-center text-sm text-foreground">{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <AudioModal audio={selectedAudio} visible={modalVisible} onClose={closeModal} />
    </View>
  );
}

const AudioModal = ({
  audio,
  visible,
  onClose,
}: {
  audio: Audio | null;
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent>
      <View className="flex-1 items-center justify-center bg-background p-4">
        <TouchableOpacity onPress={onClose} className="absolute right-4 top-12">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        {audio && <AudioCard audio={audio} />}
      </View>
    </Modal>
  );
};
