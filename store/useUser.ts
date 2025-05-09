import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabase } from '~/utils/supabase';

export type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type UserState = {
  user: User | null;
  getUser: (session: Session | null) => Promise<void>;
  updateUser: (session: Session | null, username: string, avatar_url: string) => Promise<void>;
  uploadAvatar: (session: Session | null, result: ImagePicker.ImagePickerResult) => Promise<void>;
  resetUser: () => void;
  getAnyUser: (userId: string) => Promise<User | null>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      getUser: async (session: Session | null) => {
        if (!session) throw new Error('No session found in getUser');
        const { data, error, status } = await supabase
          .from('users')
          .select(`username, avatar_url, id`)
          .eq('id', session?.user.id)
          .single();
        if (error && status !== 406) throw error;
        set({ user: data });
      },
      updateUser: async (session: Session | null, username?: string, avatar_url?: string) => {
        if (!session) throw new Error('No session found in updateUser');
        await useUserStore.getState().getUser(session);
        const user = useUserStore.getState().user;
        if (!user) throw new Error('No user found in updateUser');
        const updates = {
          id: session?.user.id,
          username: username || user?.username,
          avatar_url: avatar_url || user?.avatar_url,
          updated_at: new Date(),
        };
        const { error } = await supabase.from('users').upsert(updates);
        if (error) throw error;
        useUserStore.getState().getUser(session);
      },
      uploadAvatar: async (session: Session | null, result: ImagePicker.ImagePickerResult) => {
        if (result.canceled || !result.assets || result.assets.length === 0)
          throw new Error('No image selected');
        const image = result.assets[0];
        if (!image.uri) throw new Error('No image uri!');
        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
        const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const path = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
          });
        if (uploadError) throw uploadError;
        const user = useUserStore.getState().user;
        await useUserStore.getState().updateUser(session, user!.username, data.path);
      },
      getAnyUser: async (userId: string) => {
        const { data, error, status } = await supabase
          .from('users')
          .select(`username, avatar_url, id`)
          .eq('id', userId)
          .single();
        if (error && status !== 406) throw error;
        return data;
      },
      resetUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
