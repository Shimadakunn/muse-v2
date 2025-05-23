import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAudioPlayer } from './useAudioPlayer';
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
  liked: boolean;
};

export type SwipedAudio = {
  audio: Audio;
  liked: boolean;
  swipedAt: number;
};

type SwipeState = {
  audios: Audio[];
  getAudios: () => Promise<void>;
  swipe: (audio: Audio) => Promise<void>;
  like: (audio: Audio) => Promise<void>;
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
                liked: false,
              };
            } catch (error) {
              console.error('Error fetching user for audio:', error);
              return {
                ...audio,
                liked: false,
              };
            }
          })
        );
        set((state) => ({
          audios: addMore ? [...state.audios, ...audiosWithUsers] : audiosWithUsers,
        }));
      },
      swipe: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { error: existingSwipeError } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', user.id)
          .eq('audio_id', audio.id)
          .single();

        if (existingSwipeError) {
          const { error } = await supabase.from('swipes').insert({
            swiper_id: user.id,
            audio_id: audio.id,
            liked: false,
          });
          if (error) throw error;
          set((state) => ({
            audios: state.audios.map((a) => (a.id === audio.id ? { ...a, liked: false } : a)),
          }));
        }
        useLibraryStore.getState().getLibrary();
      },
      like: async (audio: Audio) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        const { data: existingSwipe, error: existingSwipeError } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', user.id)
          .eq('audio_id', audio.id)
          .single();

        if (existingSwipeError) {
          const { error } = await supabase.from('swipes').insert({
            swiper_id: user.id,
            audio_id: audio.id,
            liked: true,
          });
          if (error) throw error;

          set((state) => ({
            audios: state.audios.map((a) => (a.id === audio.id ? { ...a, liked: true } : a)),
          }));

          const audioPlayer = useAudioPlayer.getState();
          if (audioPlayer.currentAudio && audioPlayer.currentAudio.id === audio.id)
            useAudioPlayer.setState({
              currentAudio: { ...audioPlayer.currentAudio, liked: true },
            });
        } else {
          const { error: updateError } = await supabase
            .from('swipes')
            .update({ liked: !existingSwipe.liked })
            .eq('id', existingSwipe.id);

          if (updateError) throw updateError;

          set((state) => ({
            audios: state.audios.map((a) =>
              a.id === audio.id ? { ...a, liked: !existingSwipe.liked } : a
            ),
          }));

          const audioPlayer = useAudioPlayer.getState();
          if (audioPlayer.currentAudio && audioPlayer.currentAudio.id === audio.id)
            useAudioPlayer.setState({
              currentAudio: { ...audioPlayer.currentAudio, liked: !existingSwipe.liked },
            });
        }
        useLibraryStore.getState().getLibrary();
      },
    }),
    {
      name: 'swipe',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
