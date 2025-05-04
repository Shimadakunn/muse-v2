import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { Button, Text } from '~/components/ui';
import Cover from '~/components/ui/cover';
import { useAudioStore } from '~/store/useAudio';

export default function Post() {
  const { uploadCover, uploadAudio, postAudio } = useAudioStore();
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleCoverUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
    toast.promise(uploadCover(result, setCoverUrl), {
      loading: 'Uploading cover',
      success: (result) => 'Cover uploaded',
      error: (error: any) => error.message,
    });
  };

  const handleAudioUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      multiple: false,
    });
    toast.promise(uploadAudio(result, setAudioUrl), {
      loading: 'Uploading audio',
      success: (result) => 'Audio uploaded',
      error: (error: any) => error.message,
    });
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-4">
      <Text className="text-foreground text-2xl font-bold">coverUrl: {coverUrl}</Text>
      <Text className="text-foreground text-2xl font-bold">audioUrl: {audioUrl}</Text>
      <View className="mb-4 mt-8 w-full gap-2">
        <Text className="text-foreground text-2xl font-bold">What is the song title?</Text>
        <TextInput
          placeholder=" Song Title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none"
          autoCorrect={false}
          className="text-foreground w-full rounded-xl border border-white/70 px-4 py-2"
        />
      </View>
      <TouchableOpacity onPress={handleCoverUpload}>
        <Cover coverUrl={coverUrl} size={100} />
      </TouchableOpacity>
      <TouchableOpacity
        className="my-4 rounded-lg bg-white/10 px-4 py-2"
        onPress={handleAudioUpload}>
        {audioUrl ? <Text>Audio Uploaded</Text> : <Text>Upload Audio</Text>}
      </TouchableOpacity>
      <Button
        className="bg-accent mx-auto mb-4 flex w-[80vw] flex-row items-center justify-between rounded-full px-4 py-3"
        onPress={async () => {
          toast.promise(postAudio(title, coverUrl, audioUrl), {
            loading: 'Posting song',
            success: (result) => 'Song posted',
            error: (error: any) => error.message,
          });
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
