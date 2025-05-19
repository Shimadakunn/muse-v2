import { Image } from 'expo-image';
import { View } from 'react-native';
import { toast } from 'sonner-native';

import { Back } from '~/components/ui';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAuthStore } from '~/store/useAuth';
import { useUserStore } from '~/store/useUser';

export default function Index() {
  const { signOut } = useAuthStore();
  const { user } = useUserStore();
  return (
    <View className="flex-1">
      <Back />
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
      <Text>Protected App</Text>

      <Text>{user?.username}</Text>
      <Text>{user?.avatar_url}</Text>
      <Image
        source={{ uri: user?.avatar_url }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
    </View>
  );
}
