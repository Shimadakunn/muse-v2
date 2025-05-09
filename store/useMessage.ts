import { create } from 'zustand';

import { useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

type MessageState = {
  messages: Message[];
  getMessages: (chatId: string, olderThanId?: string) => Promise<void>;
  subscribeToMessages: (chatId: string) => () => void;
  sendMessage: (chatId: string, content: string) => Promise<void>;
};

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  getMessages: async (chatId: string, olderThanId?: string) => {
    let query = supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('sent_at', { ascending: false })
      .limit(20);

    if (olderThanId) {
      const { data: olderMessage } = await supabase
        .from('messages')
        .select('sent_at')
        .eq('id', olderThanId)
        .single();

      if (olderMessage) query = query.lt('sent_at', olderMessage.sent_at);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) throw new Error('No messages found');

    if (data.length > 0) {
      const reversedData = [...data].reverse();

      set((state) => ({
        messages: olderThanId ? [...reversedData, ...state.messages] : reversedData,
      }));
    }
  },
  subscribeToMessages: (chatId: string) => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          set((state) => ({
            messages: [...state.messages, payload.new as Message],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
  sendMessage: async (chatId: string, message: string) => {
    const { user } = useUserStore.getState();
    if (!user) throw new Error('User not found');
    const { data, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, sender_id: user.id, message });
    if (error) throw error;
  },
}));
