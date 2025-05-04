import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useUserStore } from './useUser';

import { supabase } from '~/utils/supabase';

type Audio = {
  id: string;
  title: string;
  audio_url: string;
  cover_url: string;
  posted_at: string;
  posted_by: string;
};

type AudioState = {
  audio: Audio | null;
  postAudio: (title: string, cover_url: string, audio_url: string) => Promise<void>;
  uploadCover: (
    result: ImagePicker.ImagePickerResult,
    setCoverUrl: (coverUrl: string) => void
  ) => Promise<void>;
  uploadAudio: (
    result: DocumentPicker.DocumentPickerResult,
    setAudioUrl: (audioUrl: string) => void
  ) => Promise<void>;
};

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      audio: null,
      postAudio: async (title: string, cover_url: string, audio_url: string) => {
        const { user } = useUserStore.getState();
        if (!user) throw new Error('No user found in postAudio');
        const { data, error } = await supabase
          .from('audios')
          .insert({
            title,
            cover_url,
            audio_url,
            posted_by: user.id,
          })
          .select('*')
          .single();
        console.log('postAudio data', data);
        console.log('postAudio error', error);
        if (error) throw error;
      },
      uploadCover: async (
        result: ImagePicker.ImagePickerResult,
        setCoverUrl: (coverUrl: string) => void
      ) => {
        if (result.canceled || !result.assets || result.assets.length === 0)
          throw new Error('No image selected');
        const image = result.assets[0];
        if (!image.uri) throw new Error('No image uri!');
        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
        const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const path = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('covers')
          .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
          });
        console.log('uploadCover data', data);
        console.log('uploadCover error', uploadError);
        if (uploadError) throw uploadError;
        setCoverUrl(data.path);
      },
      uploadAudio: async (
        result: DocumentPicker.DocumentPickerResult,
        setAudioUrl: (audioUrl: string) => void
      ) => {
        if (result.canceled || !result.assets || result.assets.length === 0)
          throw new Error('No audio selected');
        const audio = result.assets[0];
        if (!audio.uri) throw new Error('No audio uri!');
        const arraybuffer = await fetch(audio.uri).then((res) => res.arrayBuffer());
        const fileExt = audio.uri?.split('.').pop()?.toLowerCase() ?? 'mp3';
        const path = `${Date.now()}.${fileExt}`;
        console.log('uploadAudio path', path);
        const { data, error: uploadError } = await supabase.storage
          .from('audios')
          .upload(path, arraybuffer, {
            contentType: audio.mimeType ?? 'audio/mpeg',
          });
        console.log('uploadAudio data', data);
        console.log('uploadAudio error', uploadError);
        if (uploadError) throw uploadError;
        setAudioUrl(data.path);
      },
    }),
    {
      name: 'audio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
