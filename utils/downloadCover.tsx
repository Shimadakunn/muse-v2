import { supabase } from './supabase';

export async function downloadCover(setCoverUrl: (coverUrl: string) => void, coverUrl: string) {
  try {
    const { data, error } = await supabase.storage.from('covers').download(coverUrl);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setCoverUrl(fr.result as string);
    };
  } catch (error) {
    if (error instanceof Error) console.log('Error downloading image: ', error.message);
  }
}
