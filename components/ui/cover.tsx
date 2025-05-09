import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { downloadCover } from '~/utils/downloadCover';

export default function Cover({ coverUrl, size = 100 }: { coverUrl: string; size?: number }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (coverUrl) downloadCover(setImageUrl, coverUrl);
    else setImageUrl(null);
  }, [coverUrl]);

  return imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      accessibilityLabel="Cover"
      style={{ width: size, height: size, borderRadius: 10 }}
    />
  ) : (
    <View style={{ width: size, height: size, backgroundColor: 'gray', borderRadius: 10 }} />
  );
}
