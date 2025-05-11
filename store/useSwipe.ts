import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useLibraryStore } from './useLibrary';
import { User, useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

export type Audio = {
  id: string;
  title: string;
  posted_at: string;
  posted_by: string;
  cover_url: string;
  audio_url: string;
  posted_by_user: User;
};

export type SwipedAudio = {
  audio: Audio;
  liked: boolean;
  swipedAt: number;
};

type SwipeState = {
  audios: Audio[];
  getAudios: () => Promise<void>;
  swipeUp: (audio: Audio, liked: boolean) => Promise<void>;
  swipeDown: (audio: Audio) => Promise<void>;
  saveToLibrary: (audio: Audio) => Promise<void>;
};

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      audios: [],
      getAudios: async (addMore = false) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data: alreadySwiped, error: alreadySwipedError } = await supabase
          .from('swipes')
          .select('audio_id')
          .eq('swiper_id', user.id);

        console.log('alreadySwiped', alreadySwiped);
        console.log(
          'alreadySwiped map',
          alreadySwiped?.map((swipe) => swipe.audio_id)
        );

        if (alreadySwipedError) throw alreadySwipedError;

        const audioIdsString = `(${alreadySwiped.map((swipe) => swipe.audio_id).join(',')})`;

        const { data, error } = await supabase
          .from('random_audios')
          .select('*')
          .not('id', 'in', audioIdsString)
          .limit(10);

        if (error) throw error;

        const audiosWithUsers = await Promise.all(
          data.map(async (audio) => {
            try {
              const userData = await useUserStore.getState().getAnyUser(audio.posted_by);
              return {
                ...audio,
                posted_by_user: userData,
              };
            } catch (error) {
              console.error('Error fetching user for audio:', error);
              return audio;
            }
          })
        );

        set((state) => ({
          audios: addMore ? [...state.audios, ...audiosWithUsers] : audiosWithUsers,
        }));
      },
      swipeUp: async (audio: Audio, liked: boolean) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data, error } = await supabase.from('swipes').insert({
          swiper_id: user.id,
          audio_id: audio.id,
          liked,
        });

        if (error) throw error;

        useLibraryStore.getState().getLibrary();
      },
      swipeDown: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        console.log('swipeDown audio', audio);
        const { data, error } = await supabase
          .from('swipes')
          .delete()
          .eq('swiper_id', user.id)
          .eq('audio_id', audio.id);

        console.log('swipeDown data', data);
        console.log('swipeDown error', error);

        if (error) throw error;

        useLibraryStore.getState().getLibrary();
      },
      saveToLibrary: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data, error } = await supabase.from('swipes').insert({
          swiper_id: user.id,
          audio_id: audio.id,
          liked: true,
        });

        if (error) throw error;

        useLibraryStore.getState().getLibrary();
      },
    }),
    {
      name: 'swipe',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
