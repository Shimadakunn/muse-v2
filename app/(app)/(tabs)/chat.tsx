import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useChatStore } from '~/store/useChat';

export default function Chat() {
  const { chats, createChat, getChats } = useChatStore();
  useEffect(() => {
    getChats();
  }, []);
  return (
    <View className="flex-1 bg-background">
      <Text>Chat</Text>
      <Button
        onPress={() =>
          toast.promise(
            createChat(
              '566e27f4-25d1-4972-8651-3aa5dfa5cf63',
              'f0cd6ba2-36de-4a84-99df-05283d7a1dae'
            ),
            {
              loading: 'Creating chat...',
              success: (result) => `Chat created`,
              error: 'Failed to create chat',
            }
          )
        }>
        <Text>Create Chat</Text>
      </Button>
      <Button
        onPress={() =>
          toast.promise(getChats(), {
            loading: 'Getting chats...',
            success: (result) => `Chats fetched`,
            error: 'Failed to fetch chats',
          })
        }>
        <Text>Get Chats</Text>
      </Button>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => router.push(`/(app)/messages?chatId=${chat.id}`)}
          className="flex-row items-center justify-between border-b border-gray-200 p-2">
          <View className="flex-row items-center space-x-2">
            <Image
              source={{ uri: chat.other_user?.avatar_url || '' }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <Text>{chat.other_user?.username || 'Unknown'}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-500">{chat.created_at}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
