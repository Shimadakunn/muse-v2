import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { View } from 'react-native';

import AppleSvg from '~/assets/svg/apple.svg';
import GoogleSvg from '~/assets/svg/google.svg';
import IconSvg from '~/assets/svg/icon.svg';
import MailSvg from '~/assets/svg/mail.svg';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAuthStore } from '~/store/useAuth';
import { supabase } from '~/utils/supabase';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const { connect, connectWithGoogle } = useAuthStore();
  return (
    <View className="relative my-4 flex-1 items-center justify-end">
      <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
        <IconSvg width={60} height={60} />
        <Text className="text-foreground mt-4 text-center text-3xl font-black">
          For independent artists.
        </Text>
        <Text className="text-foreground text-center text-3xl font-black">
          Help each other to grow.
        </Text>
      </View>
      <View className="gap-2">
        <Button
          className="bg-accent mx-auto flex w-[80vw] flex-row items-center justify-between rounded-full px-4 py-3"
          onPress={() => router.push('/email')}>
          <MailSvg width={22} height={22} />
          <Text className="text-center text-lg font-bold">Use your e-mail</Text>
          <View />
        </Button>
        <Button
          className="mx-auto flex w-[80vw] flex-row items-center justify-between rounded-full border border-white/70 px-4 py-3"
          onPress={async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
            });
            if (error) throw error;
            console.log('data', data);
            await WebBrowser.openBrowserAsync(data.url);
          }}>
          <GoogleSvg width={20} height={20} />
          <Text className="text-center text-lg font-bold text-white">Use your Google account</Text>
          <View />
        </Button>
        <Button
          className="mx-auto flex w-[80vw] flex-row items-center justify-between rounded-full border border-white/70 px-4 py-3"
          onPress={() => {}}>
          <AppleSvg width={20} height={20} />
          <Text className="text-center text-lg font-bold text-white">Use your Apple account</Text>
          <View />
        </Button>
      </View>
      {/* <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Avatar URL" value={avatar_url} onChangeText={setAvatarUrl} />
      <Button
        title="Login"
        onPress={() =>
          toast.promise(signIn(email, password), {
            loading: 'Logging in',
            success: (result) => 'Logged in successfully',
            // @ts-expect-error
            error: (error) => error.message,
          })
        }
      />
      <Button
        title="Sign Up"
        onPress={() =>
          toast.promise(signUp(email, password, username, avatar_url), {
            loading: 'Signing up',
            success: (result) => 'Signed up successfully',
            // @ts-expect-error
            error: (error) => error.message,
          })
        }
      /> */}
    </View>
  );
}
