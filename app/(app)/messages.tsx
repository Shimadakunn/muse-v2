import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, TextInput, View } from 'react-native';

import SendIcon from '~/assets/svg/send.svg';
import { Back, Button, Text } from '~/components/ui';
import { useChatStore } from '~/store/useChat';
import { useMessageStore } from '~/store/useMessage';
import { useUserStore } from '~/store/useUser';

export default function Messages() {
  const { chatId } = useLocalSearchParams();
  const { messages, getMessages, subscribeToMessages, sendMessage } = useMessageStore();
  const { user } = useUserStore();

  const [message, setMessage] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState(0);
  const COOLDOWN_MS = 1000; // 1 second cooldown
  const [initialLoad, setInitialLoad] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (typeof chatId === 'string') {
      getMessages(chatId).then(() => {
        setInitialLoad(false);
      });
      const unsubscribe = subscribeToMessages(chatId);
      return () => {
        unsubscribe();
      };
    }
  }, [chatId]);

  // Scroll to bottom when new messages arrive or on initial load
  useEffect(() => {
    if (messages.length > 0 && !loadingMore) {
      flatListRef.current?.scrollToEnd({ animated: !initialLoad });
    }
  }, [messages.length, initialLoad]);

  const handleLoadMore = async () => {
    if (!messages || messages.length === 0) return;

    const now = Date.now();
    if (loadingMore || now - lastLoadTime < COOLDOWN_MS) return;

    setLoadingMore(true);
    await getMessages(chatId as string, messages[0].id);
    setLastLoadTime(now);
    setLoadingMore(false);
  };

  const renderLoadingIndicator = () => {
    if (loadingMore) {
      return (
        <View className="items-center py-2">
          <ActivityIndicator size="small" />
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Header chatId={chatId as string} />
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Message message={item.message} isUser={item.sender_id === user?.id} />
          )}
          ListHeaderComponent={renderLoadingIndicator}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={100}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
          onLayout={() => {
            if (initialLoad && messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y < 20) {
              handleLoadMore();
            }
          }}
        />
      </View>
      <View className="relative w-full px-2 pb-2">
        <TextInput
          placeholder="Your message..."
          className="rounded-full border border-foreground/70 bg-card py-3 pl-3 text-foreground placeholder:text-foreground/50"
          value={message}
          onChangeText={setMessage}
        />
        {message.length > 0 && (
          <Button
            className="absolute bottom-[4px] right-[5px] rounded-full bg-accent px-3 py-1"
            onPress={() => {
              sendMessage(chatId as string, message);
              setMessage('');
            }}>
            <SendIcon />
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const Header = ({ chatId }: { chatId: string }) => {
  const { chats } = useChatStore();
  const chat = chats.find((chat) => chat.id === chatId);
  return (
    <View className="w-full flex-row items-center justify-start gap-2">
      <Back />
      <Image
        source={{ uri: chat?.other_user?.avatar_url || '' }}
        style={{ width: 32, height: 32, borderRadius: 16 }}
      />
      <Text className="text-lg font-bold text-foreground">
        {chat?.other_user?.username || 'Unknown'}
      </Text>
    </View>
  );
};

const Message = ({ message, isUser }: { message: string; isUser: boolean }) => {
  return (
    <View className={`w-full flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <View className={`max-w-[70%] rounded-full px-4 py-2 ${isUser ? 'bg-accent' : 'bg-card'}`}>
        <Text className={`${isUser ? 'text-background' : 'text-foreground'}`}>{message}</Text>
      </View>
    </View>
  );
};
