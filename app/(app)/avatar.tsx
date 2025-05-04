import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, Image, View } from 'react-native';
import { toast } from 'sonner-native';

import { useAuthStore } from '~/store/useAuth';
import { useUserStore } from '~/store/useUser';
import { downloadAvatar } from '~/utils/downloadAvatar';
import { supabase } from '~/utils/supabase';

export default function Avatar() {
  const { session } = useAuthStore();
  const { user, updateUser } = useUserStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.avatar_url) downloadAvatar(setImageUrl, user.avatar_url);
    else setImageUrl(null);
  }, [user?.avatar_url]);

  async function uploadAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
    if (result.canceled || !result.assets || result.assets.length === 0)
      throw new Error('No image selected');
    const image = result.assets[0];
    console.log('Got image', image);
    if (!image.uri) throw new Error('No image uri!');
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
    const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
    const path = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? 'image/jpeg',
      });
    if (uploadError) throw uploadError;
    updateUser(session, user!.username, data.path);
  }

  return (
    <View>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          accessibilityLabel="Avatar"
          style={{ width: 100, height: 100 }}
        />
      ) : (
        <View style={{ width: 100, height: 100, backgroundColor: 'gray' }} />
      )}
      <View>
        <Button
          title="Upload"
          onPress={() =>
            toast.promise(uploadAvatar(), {
              loading: 'Uploading...',
              success: (result) => 'Uploaded!',
              error: 'Error uploading!',
            })
          }
        />
      </View>
    </View>
  );
}
