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
  currentAudio: Audio | null;
  recentlySwipedAudios: SwipedAudio[];
  getAudios: () => Promise<void>;
  swipeRight: (audio: Audio) => Promise<void>;
  swipeUp: (audio: Audio) => Promise<void>;
  cancelLastSwipe: () => Promise<void>;
};

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      audios: [],
      currentAudio: null,
      recentlySwipedAudios: [],
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
      swipeRight: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data, error } = await supabase.from('swipes').insert({
          swiper_id: user.id,
          audio_id: audio.id,
          liked: true,
        });

        if (error) throw error;

        useLibraryStore.getState().getLibrary();

        set((state) => {
          // Add to recently swiped audios
          const newRecentlySwipedAudios = [
            { audio, liked: true, swipedAt: Date.now() },
            ...state.recentlySwipedAudios,
          ].slice(0, 3); // Keep only last 3 swipes

          return {
            audios: state.audios.filter((a) => a.id !== audio.id),
            currentAudio: state.audios.length > 1 ? state.audios[1] : null,
            recentlySwipedAudios: newRecentlySwipedAudios,
          };
        });
      },
      swipeUp: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data, error } = await supabase.from('swipes').insert({
          swiper_id: user.id,
          audio_id: audio.id,
          liked: false,
        });

        if (error) throw error;

        set((state) => {
          // Add to recently swiped audios
          const newRecentlySwipedAudios = [
            { audio, liked: false, swipedAt: Date.now() },
            ...state.recentlySwipedAudios,
          ].slice(0, 3);

          return {
            audios: state.audios.filter((a) => a.id !== audio.id),
            currentAudio: state.audios.length > 1 ? state.audios[1] : null,
            recentlySwipedAudios: newRecentlySwipedAudios,
          };
        });
      },
      cancelLastSwipe: async () => {
        const state = get();
        const { user } = useUserStore.getState();

        if (!user) throw new Error('User not found');
        if (state.recentlySwipedAudios.length === 0) return;

        const lastSwipe = state.recentlySwipedAudios[0];

        // Delete the swipe from the database
        const { error } = await supabase.from('swipes').delete().match({
          swiper_id: user.id,
          audio_id: lastSwipe.audio.id,
        });

        if (error) throw error;

        // If it was a liked audio, refresh the library to remove it
        if (lastSwipe.liked) {
          useLibraryStore.getState().getLibrary();
        }

        set((state) => ({
          // Add the audio back to the queue
          audios: [lastSwipe.audio, ...state.audios],
          // Update the current audio to be the recovered one
          currentAudio: lastSwipe.audio,
          // Remove the swiped audio from the history
          recentlySwipedAudios: state.recentlySwipedAudios.slice(1),
        }));
      },
    }),
    {
      name: 'swipe',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
