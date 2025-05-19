import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

import { Audio as AudioType } from './useSwipe';

interface AudioPlayerState {
  currentAudio: AudioType | null;
  audioPlayer: AudioPlayer | null;
  position: number;
  duration: number;
  setAudioPlayer: (audio: AudioType, audio_url: string) => void;
  playAudio: (audio: AudioType) => Promise<void>;
  updateProgress: () => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => {
  let progressInterval: NodeJS.Timeout | null = null;

  return {
    currentAudio: null,
    audioPlayer: null,
    position: 0,
    duration: 0,

    setAudioPlayer: (audio: AudioType, audio_url: string) => {
      const { audioPlayer } = get();

      if (audioPlayer) {
        audioPlayer.replace(audio_url);
      } else {
        const newPlayer = createAudioPlayer({ uri: audio_url });
        set({ audioPlayer: newPlayer });
      }

      set({ currentAudio: audio });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => get().updateProgress(), 500);
    },

    playAudio: async (audio: AudioType) => {
      const { audioPlayer, currentAudio } = get();

      if (audioPlayer && currentAudio && currentAudio.id === audio.id) {
        if (audioPlayer.playing) audioPlayer.pause();
        else audioPlayer.play();
        return;
      }

      try {
        get().setAudioPlayer(audio, audio.audio_url);
        get().audioPlayer?.play();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
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
