import { supabase } from './supabase';

export async function downloadAudio(setAudioUrl: (audioUrl: string) => void, audioUrl: string) {
  try {
    const { data, error } = await supabase.storage.from('audios').download(audioUrl);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setAudioUrl(fr.result as string);
    };
  } catch (error) {
    if (error instanceof Error) console.log('Error downloading audio: ', error.message);
  }
}
