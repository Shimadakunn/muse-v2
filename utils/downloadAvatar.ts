import { supabase } from './supabase';

export async function downloadAvatar(setAvatarUrl: (avatarUrl: string) => void, avatarUrl: string) {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(avatarUrl);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setAvatarUrl(fr.result as string);
    };
  } catch (error) {
    if (error instanceof Error) console.log('Error downloading image: ', error.message);
  }
}
