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
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => {
  let progressInterval: NodeJS.Timeout | null = null;

  return {
    currentAudio: null,
    audioPlayer: null,
    position: 0,
    duration: 0,

    playPauseAudio: async () => {
      const { audioPlayer } = get();
      if (audioPlayer!.playing) audioPlayer!.pause();
      else audioPlayer!.play();
    },

    playQuarter: async (audio: AudioType, direction: 'next' | 'previous' | 'start') => {
      await get().setAudioPlayer(audio);
      const waitForDuration = async () => {
        let tries = 0;
        while ((!get().audioPlayer?.isLoaded || !get().audioPlayer?.duration) && tries < 20) {
          await new Promise((res) => setTimeout(res, 100));
          tries++;
        }
      };
      await waitForDuration();
      const { audioPlayer } = get();
      const duration = audioPlayer!.duration;
      if (!duration) return;

      let quarter = 0;
      if (direction === 'next') {
        const currentQuarter = Math.floor((audioPlayer!.currentTime / duration) * 4);
        quarter = Math.min(currentQuarter + 1, 3);
      } else if (direction === 'previous') {
        const currentQuarter = Math.floor((audioPlayer!.currentTime / duration) * 4);
        quarter = Math.max(currentQuarter - 1, 0);
      }
      // direction === 'start' will use quarter = 0

      audioPlayer!.seekTo((quarter * duration) / 4);
      audioPlayer?.play();
    },

    setAudioPlayer: async (audio: AudioType) => {
      const { audioPlayer, currentAudio } = get();
      if (currentAudio && currentAudio.id === audio.id) return;

      if (audioPlayer) audioPlayer.replace(audio.audio_url);
      else set({ audioPlayer: createAudioPlayer({ uri: audio.audio_url }) });

      set({ currentAudio: audio });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => get().updateProgress(), 500);
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
  };
});
