import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { Text } from '~/components/ui/text';
import { useLibraryStore } from '~/store/useLibrary';

export default function Library() {
  const { library, getLibrary } = useLibraryStore();

  useFocusEffect(
    useCallback(() => {
      getLibrary();
    }, [])
  );

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
        numColumns={3}
        columnWrapperStyle={{ gap: 2, justifyContent: 'space-between' }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="m-2">
            <Image
              source={{ uri: item.cover_url }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
              placeholder={{ uri: item.cover_url }}
            />
            <Text className="mt-2 text-center text-sm text-foreground">{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
