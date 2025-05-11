import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { downloadCover } from '~/utils/downloadCover';

export default function Cover({ coverUrl, className }: { coverUrl: string; className?: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (coverUrl) downloadCover(setImageUrl, coverUrl);
    else setImageUrl(null);
  }, [coverUrl]);

  return imageUrl ? (
    <Image source={{ uri: imageUrl }} accessibilityLabel="Cover" className={className} />
  ) : (
    <View className={className} />
  );
}
