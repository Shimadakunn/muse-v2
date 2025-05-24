import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

import { Audio as AudioType } from './useSwipe';

interface AudioPlayerState {
  currentAudio: AudioType | null;
  audioPlayer: AudioPlayer | null;
  position: number;
  duration: number;
  isTransitioning: boolean;
  lastPosition: number;
  lastDuration: number;
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
    isTransitioning: false,
    lastPosition: 0,
    lastDuration: 0,

    playPauseAudio: async () => {
      const { audioPlayer } = get();
      if (!audioPlayer) return;

      if (audioPlayer.playing) audioPlayer.pause();
      else audioPlayer.play();
    },

    playQuarter: async (audio: AudioType, direction: 'next' | 'previous' | 'start') => {
      const isSameAudio = get().currentAudio?.id === audio.id;

      // Set transitioning state if switching to a new audio
      if (!isSameAudio) {
        // Save current position and duration before transitioning
        const { position, duration } = get();
        set({
          isTransitioning: true,
          lastPosition: position,
          lastDuration: duration,
        });
        await get().setAudioPlayer(audio);
      }

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

      // Reset transitioning state after a short delay
      setTimeout(() => {
        set({ isTransitioning: false });
      }, 300);
    },

    setAudioPlayer: async (audio: AudioType) => {
      const { audioPlayer, currentAudio } = get();
      if (currentAudio && currentAudio.id === audio.id) return;

      // Keep the previous playing state when transitioning
      const wasPlaying = audioPlayer?.playing || false;

      if (audioPlayer) audioPlayer.replace(audio.audio_url);
      else set({ audioPlayer: createAudioPlayer({ uri: audio.audio_url }) });

      set({ currentAudio: audio });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => get().updateProgress(), 250); // Reduced interval for smoother UI

      // Maintain play state when transitioning
      const newPlayer = get().audioPlayer;
      if (newPlayer && wasPlaying) {
        newPlayer.play();
      }
    },

    updateProgress: () => {
      const { audioPlayer, isTransitioning, lastPosition, lastDuration } = get();

      if (audioPlayer) {
        if (isTransitioning) {
          // During transition, keep using the last position/duration
          set({
            position: lastPosition,
            duration: lastDuration || 1, // Avoid division by zero
          });
        } else {
          // Normal update when not transitioning
          set({
            position: audioPlayer.currentTime,
            duration: audioPlayer.duration,
            lastPosition: audioPlayer.currentTime,
            lastDuration: audioPlayer.duration,
          });
        }
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
