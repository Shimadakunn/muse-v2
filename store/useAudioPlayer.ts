import { AVPlaybackStatus, Audio as ExpoAudio } from 'expo-av';
import { create } from 'zustand';

import { Audio as AudioType } from './useSwipe';

import { downloadAudio } from '~/utils/downloadAudio';

interface AudioPlayerState {
  currentAudio: AudioType | null;
  isPlaying: boolean;
  sound: ExpoAudio.Sound | null;
  duration: number;
  position: number;
  isLoading: boolean;
  playAudio: (audio: AudioType) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  seekAudio: (position: number) => Promise<void>;
  updatePosition: (position: number) => void;
  updateDuration: (duration: number) => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  currentAudio: null,
  isPlaying: false,
  sound: null,
  duration: 0,
  position: 0,
  isLoading: false,

  playAudio: async (audio: AudioType) => {
    const { sound: currentSound, currentAudio } = get();

    if (currentSound && currentAudio?.id !== audio.id) {
      await currentSound.unloadAsync();
    } else if (currentAudio?.id === audio.id && currentSound) {
      await get().resumeAudio();
      return;
    }

    set({ isLoading: true, currentAudio: audio });

    try {
      let audioUri: string | null = null;

      // Download the audio file
      await new Promise<void>((resolve) => {
        downloadAudio((uri) => {
          audioUri = uri;
          resolve();
        }, audio.audio_url);
      });

      if (!audioUri) throw new Error('Failed to download audio');

      // Create and load the Audio object
      const { sound } = await ExpoAudio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            set({
              position: status.positionMillis,
            });
          }
        }
      );

      // Set sound object and update state
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          set({
            position: status.positionMillis,
            duration: status.durationMillis || 0,
          });
        }
      });

      set({ sound, isPlaying: true, isLoading: false });
    } catch (error) {
      console.error('Error playing audio:', error);
      set({ isLoading: false });
    }
  },

  pauseAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  resumeAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  stopAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({
        sound: null,
        isPlaying: false,
        position: 0,
        duration: 0,
      });
    }
  },

  seekAudio: async (position: number) => {
    const { sound } = get();
    if (sound) {
      await sound.setPositionAsync(position);
      set({ position });
    }
  },

  updatePosition: (position: number) => {
    set({ position });
  },

  updateDuration: (duration: number) => {
    set({ duration });
  },
}));
