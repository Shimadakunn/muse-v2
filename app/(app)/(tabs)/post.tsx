import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { Button, Text } from '~/components/ui';
import { useAudioStore } from '~/store/useAudio';

export default function Post() {
  const { uploadCover, uploadAudio, postAudio } = useAudioStore();
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleCoverUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      exif: false,
    });
    if (result.canceled) return;
    const coverUrl = await uploadCover(result);
    setCoverUrl(coverUrl as string);
  };

  const handleAudioUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      multiple: false,
    });
    if (result.canceled) return;
    const audioUrl = await uploadAudio(result);
    setAudioUrl(audioUrl as string);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text className="text-2xl font-bold text-foreground">coverUrl: {coverUrl}</Text>
      <Text className="text-2xl font-bold text-foreground">audioUrl: {audioUrl}</Text>
      <View className="mb-4 mt-8 w-full gap-2">
        <Text className="text-2xl font-bold text-foreground">What is the song title?</Text>
        <TextInput
          placeholder=" Song Title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none"
          autoCorrect={false}
          className="w-full rounded-xl border border-white/70 px-4 py-2 text-foreground"
        />
      </View>
      <TouchableOpacity onPress={handleCoverUpload}>
        <Image source={{ uri: coverUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      </TouchableOpacity>
      <TouchableOpacity
        className="my-4 rounded-lg bg-white/10 px-4 py-2"
        onPress={handleAudioUpload}>
        {audioUrl ? <Text>Audio Uploaded</Text> : <Text>Upload Audio</Text>}
      </TouchableOpacity>
      <Button
        className="mx-auto mb-4 flex w-[80vw] flex-row items-center justify-between rounded-full bg-accent px-4 py-3"
        onPress={async () => {
          await postAudio(title, coverUrl, audioUrl);
          setTitle('');
          setCoverUrl('');
          setAudioUrl('');
        }}
        disabled={!title || !coverUrl || !audioUrl}>
        <Text className="mx-auto text-center text-xl font-bold">Post Song</Text>
        <View />
      </Button>
    </View>
  );
}
