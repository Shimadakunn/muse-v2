import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

import { Audio as AudioType } from './useSwipe';

interface AudioPlayerState {
  currentAudio: AudioType | null;
  audioPlayer: AudioPlayer | null;
  position: number;
  duration: number;
  setAudioPlayer: (audio: AudioType, audio_url: string) => Promise<void>;
  playAudio: (audio: AudioType, quarter?: number | null) => Promise<void>;
  updateProgress: () => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => {
  let progressInterval: NodeJS.Timeout | null = null;

  return {
    currentAudio: null,
    audioPlayer: null,
    position: 0,
    duration: 0,

    setAudioPlayer: async (audio: AudioType, audio_url: string) => {
      const { audioPlayer } = get();

      if (audioPlayer) audioPlayer.replace(audio_url);
      else set({ audioPlayer: createAudioPlayer({ uri: audio_url }) });

      set({ currentAudio: audio });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => get().updateProgress(), 500);
    },

    playAudio: async (audio: AudioType, quarter: number | null = null) => {
      const { audioPlayer, currentAudio } = get();
      console.log('quarter', quarter);

      if (audioPlayer && currentAudio && currentAudio.id === audio.id) {
        if (audioPlayer.playing && !quarter) audioPlayer.pause();
        else {
          const duration = audioPlayer.duration;
          console.log('old audio duration', duration);
          if (duration) audioPlayer.seekTo((quarter * duration) / 4);
          audioPlayer.play();
        }
        return;
      }

      try {
        await get().setAudioPlayer(audio, audio.audio_url);
        const waitForDuration = async () => {
          let tries = 0;
          while ((!get().audioPlayer?.isLoaded || !get().audioPlayer?.duration) && tries < 20) {
            await new Promise((res) => setTimeout(res, 100));
            tries++;
          }
        };
        await waitForDuration();

        const duration = get().audioPlayer?.duration;
        if (duration) get().audioPlayer?.seekTo((quarter * duration) / 4);
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
