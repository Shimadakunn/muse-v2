import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Audio } from './useSwipe';
import { useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

type LibraryState = {
  library: Audio[];
  getLibrary: (olderThanId?: string) => Promise<void>;
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      library: [],
      getLibrary: async (olderThanId?: string) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('User not found');

        let query = supabase
          .from('swipes')
          .select('audio_id, swiped_at')
          .eq('swiper_id', user.id)
          .eq('liked', true)
          .order('swiped_at', { ascending: false })
          .limit(10);

        if (olderThanId) {
          const { data: olderSwipe } = await supabase
            .from('swipes')
            .select('swiped_at')
            .eq('id', olderThanId)
            .single();

          if (olderSwipe) query = query.lt('swiped_at', olderSwipe.swiped_at);
        }

        const { data: swipes, error } = await query;

        if (!swipes) throw new Error('No swipes found');
        if (error) throw error;

        if (swipes.length === 0) {
          set((state) => ({
            library: olderThanId ? [...sortedAudioData, ...state.library] : sortedAudioData,
          }));
          return;
        }
        const audioIds = swipes.map((swipe) => swipe.audio_id);
        const { data: audioData, error: audioError } = await supabase
          .from('audios')
          .select('*')
          .in('id', audioIds);

        if (audioError) throw audioError;

        const swipeOrder = new Map(swipes.map((swipe) => [swipe.audio_id, swipe.swiped_at]));

        const audiosWithUsers = await Promise.all(
          audioData.map(async (audio) => {
            const userData = await useUserStore.getState().getAnyUser(audio.posted_by);
            return {
              ...audio,
              posted_by_user: userData,
              liked: true,
            };
          })
        );

        const sortedAudioData = audiosWithUsers.sort((a, b) => {
          const aTime = swipeOrder.get(a.id) || 0;
          const bTime = swipeOrder.get(b.id) || 0;
          return bTime - aTime;
        });
        set((state) => ({
          library: olderThanId ? [...sortedAudioData, ...state.library] : sortedAudioData,
        }));
      },
    }),
    {
      name: 'library',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
