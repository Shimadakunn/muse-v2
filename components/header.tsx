import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { Button, Text } from './ui';

import { useUserStore } from '~/store/useUser';
import { downloadAvatar } from '~/utils/downloadAvatar';

export default function Header() {
  const { user } = useUserStore();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.avatar_url) downloadAvatar(setAvatarUrl);
    else setAvatarUrl(null);
  }, [user?.avatar_url]);

  const pathname = usePathname();
  return (
    <View className="bg-background flex-row items-center  gap-4 px-4">
      <Button onPress={() => router.push('/profile')}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="h-10 w-10 rounded-full" />
        ) : (
          <View className="h-10 w-10 rounded-full bg-gray-500" />
        )}
      </Button>
      <Text className="text-foreground text-2xl font-bold">
        {pathname.split('/').pop()!.charAt(0).toUpperCase() + pathname.split('/').pop()!.slice(1)}
      </Text>
    </View>
  );
}
