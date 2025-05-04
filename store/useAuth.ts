import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { generateFromEmail } from 'unique-username-generator';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

type AuthState = {
  session: Session | null;
  connect: (email: string, password: string) => Promise<void>;
  connectWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      connect: async (email, password) => {
        let { data, error } = await supabase.auth.signUp({ email, password });
        if (error && error.message !== 'User already registered') throw error;
        if (error && error.message === 'User already registered') {
          ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
          if (error) throw error;
        } else {
          const username = generateFromEmail(email, 2);
          if (data.session) await useUserStore.getState().updateUser(data.session, username, '');
        }
        set({ session: data.session });
        await useUserStore.getState().getUser(data.session);
      },
      connectWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });
        if (error) throw error;
        console.log('data', data);
        // set({ session: data.session });
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ session: null });
        useUserStore.getState().resetUser();
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
