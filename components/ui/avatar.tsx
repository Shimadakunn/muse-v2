import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { downloadAvatar } from '~/utils/downloadAvatar';

export default function Avatar({ avatarUrl, size = 100 }: { avatarUrl: string; size?: number }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (avatarUrl) downloadAvatar(setImageUrl, avatarUrl);
    else setImageUrl(null);
  }, [avatarUrl]);

  return imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      accessibilityLabel="Avatar"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  ) : (
    <View style={{ width: size, height: size, backgroundColor: 'gray', borderRadius: size / 2 }} />
  );
}
