import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { Back, Button, Text } from '~/components/ui';
import Avatar from '~/components/ui/avatar';
import { useAuthStore } from '~/store/useAuth';
import { useUserStore } from '~/store/useUser';

export default function Profile() {
  const { user, uploadAvatar } = useUserStore();
  const { signOut } = useAuthStore();
  const { session } = useAuthStore();
  const [username, setUsername] = useState(user?.username);

  const handleAvatarUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
    if (!result.assets?.[0]) return;
    toast.promise(uploadAvatar(session, result), {
      loading: 'Uploading avatar',
      success: (result) => 'Avatar uploaded',
      // @ts-expect-error
      error: (error) => error.message,
    });
  };

  return (
    <View className="flex-1 bg-background px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4">
        <Back />
        <Text className="text-2xl font-bold text-foreground">Edit Profile</Text>
        <Button onPress={() => {}}>
          <Text>Save</Text>
        </Button>
      </View>

      {/* Avatar */}
      <TouchableOpacity onPress={handleAvatarUpload} className="mx-auto">
        <Avatar avatarUrl={user?.avatar_url || ''} size={100} />
        <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center rounded-full bg-black/50">
          <Camera size={24} color="white" />
        </View>
      </TouchableOpacity>

      {/* Username */}
      <View className="mb-4 mt-8">
        <Text className=" font-bold text-foreground">Username</Text>
        <TextInput
          placeholder=" Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
          autoCorrect={false}
          className="w-full py-2 text-foreground"
        />
      </View>
    </View>
  );
}
