import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Edit } from 'lucide-react-native';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { Button, Text } from '~/components/ui';
import Avatar from '~/components/ui/avatar';
import { useAuthStore } from '~/store/useAuth';
import { useUserStore } from '~/store/useUser';

export default function Profile() {
  const { user, uploadAvatar } = useUserStore();
  const { signOut } = useAuthStore();
  const { session } = useAuthStore();

  const handleAvatarUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
    toast.promise(uploadAvatar(session, result), {
      loading: 'Uploading avatar',
      success: (result) => 'Avatar uploaded',
      // @ts-expect-error
      error: (error) => error.message,
    });
  };

  return (
    <View className="flex-1 bg-background">
      <Pressable onPress={() => router.push('/(app)/(tabs)/(profile)/edit')}>
        <Edit size={24} color="white" />
      </Pressable>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={handleAvatarUpload}>
          <Avatar avatarUrl={user?.avatar_url || ''} size={100} />
        </TouchableOpacity>
        <Text>{user?.username}</Text>
        <Text>{user?.id}</Text>
      </View>

      <Button
        className="mx-auto flex rounded-full bg-red-400 px-12 py-3"
        onPress={() =>
          toast.promise(signOut(), {
            loading: 'Signing out',
            success: (result) => 'Signed out',
            // @ts-expect-error
            error: (error) => error.message,
          })
        }>
        <Text className="text-center text-lg font-bold">Sign Out</Text>
      </Button>
    </View>
  );
}
