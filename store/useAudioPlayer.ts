import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

import { Audio as AudioType } from './useSwipe';

interface AudioPlayerState {
  currentAudio: AudioType | null;
  audioPlayer: AudioPlayer | null;
  position: number;
  duration: number;
  playPauseAudio: () => Promise<void>;
  playQuarter: (audio: AudioType, direction: 'next' | 'previous' | 'start') => Promise<void>;
  setAudioPlayer: (audio: AudioType) => Promise<void>;
  updateProgress: () => void;
  preloadAudio: (audioUrl: string) => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => {
  let progressInterval: NodeJS.Timeout | null = null;
  const audioCache: Record<string, boolean> = {};

  return {
    currentAudio: null,
    audioPlayer: null,
    position: 0,
    duration: 0,

    playPauseAudio: async () => {
      const { audioPlayer } = get();
      if (!audioPlayer) return;

      if (audioPlayer.playing) audioPlayer.pause();
      else audioPlayer.play();
    },

    playQuarter: async (audio: AudioType, direction: 'next' | 'previous' | 'start') => {
      const isSameAudio = get().currentAudio?.id === audio.id;

      if (!isSameAudio) await get().setAudioPlayer(audio);

      const waitForDuration = async () => {
        let tries = 0;
        while ((!get().audioPlayer?.isLoaded || !get().audioPlayer?.duration) && tries < 20) {
          await new Promise((res) => setTimeout(res, 50)); // Reduced timeout for faster response
          tries++;
        }
      };

      await waitForDuration();
      const { audioPlayer } = get();
      if (!audioPlayer) return;

      const duration = audioPlayer.duration;
      if (!duration) return;

      let quarter = 1;
      if (direction === 'next') {
        const currentQuarter = Math.floor((audioPlayer.currentTime / duration) * 4);
        quarter = Math.min(currentQuarter + 1, 3);
      } else if (direction === 'previous') {
        const currentQuarter = Math.floor((audioPlayer.currentTime / duration) * 4);
        quarter = Math.max(currentQuarter - 1, 0);
      }

      audioPlayer.seekTo((quarter * duration) / 4);
      audioPlayer.play();
    },

    setAudioPlayer: async (audio: AudioType) => {
      const { audioPlayer, currentAudio } = get();
      if (currentAudio && currentAudio.id === audio.id) return;

      if (audioPlayer) audioPlayer.replace(audio.audio_url);
      else set({ audioPlayer: createAudioPlayer({ uri: audio.audio_url }) });

      set({ currentAudio: audio });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => get().updateProgress(), 250); // Reduced interval for smoother UI
    },

    updateProgress: () => {
      const { audioPlayer } = get();
      if (audioPlayer) {
        set({
          position: audioPlayer.currentTime,
          duration: audioPlayer.duration,
        });
      }
    },

    preloadAudio: (audioUrl: string) => {
      // Skip if already preloaded
      if (audioCache[audioUrl]) return;

      try {
        // Just create the player but don't play it - this will cache the resource
        createAudioPlayer({ uri: audioUrl });

        // Mark as preloaded
        audioCache[audioUrl] = true;
      } catch (error) {
        console.error('Error preloading audio:', error);
      }
    },
  };
});
