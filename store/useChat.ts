import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type Chat = {
  id: string;
  created_at: string;
  creator_id: string;
  participant_id: string;
  other_user: User;
};

type ChatState = {
  chats: Chat[];
  createChat: (creator_id: string, participant_id: string) => Promise<void>;
  getChats: () => Promise<void>;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      createChat: async (creator_id: string, participant_id: string) => {
        const { data, error } = await supabase
          .from('chats')
          .insert({ creator_id, participant_id })
          .select('*')
          .single();
        console.log('createChat data', data);
        console.log('createChat error', error);
        if (error) throw error;
        await useChatStore.getState().getChats();
      },
      getChats: async () => {
        const user = useUserStore.getState().user;
        if (!user) throw new Error('No user found in getChats');
        console.log('getChats user', user?.id);
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .or(`creator_id.eq.${user.id},participant_id.eq.${user.id}`);
        if (error) throw error;
        if (!data || data.length === 0) {
          set({ chats: [] });
          return;
        }
        const otherUserIds = [
          ...new Set(
            data.map((chat) =>
              chat.creator_id === user.id ? chat.participant_id : chat.creator_id
            )
          ),
        ];
        const { data: otherUsers, error: otherError } = await supabase
          .from('users')
          .select('*')
          .in('id', otherUserIds);
        if (otherError) throw otherError;
        // Map each chat to its corresponding other user
        const chats = data.map((chat) => {
          const otherUserId = chat.creator_id === user.id ? chat.participant_id : chat.creator_id;
          return {
            ...chat,
            other_user: otherUsers.find((u) => u.id === otherUserId),
          };
        });
        set({ chats });
      },
    }),
    {
      name: 'chat',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
