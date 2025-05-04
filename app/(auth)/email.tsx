import { useState } from 'react';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import EyeSvg from '~/assets/svg/eye.svg';
import { Back, Button } from '~/components/ui';
import { Text } from '~/components/ui/text';
import { useAuthStore } from '~/store/useAuth';

export default function Email() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { connect } = useAuthStore();
  return (
    <KeyboardAvoidingView className="flex-1 justify-between px-4">
      <View>
        <Back />
        <View className="mb-4 mt-8 gap-2">
          <Text className="text-foreground text-2xl font-bold">What's your e-mail?</Text>
          <TextInput
            placeholder=" Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            className="text-foreground w-full rounded-xl border border-white/70 px-4 py-2"
          />
        </View>
        <View className="gap-2">
          <Text className="text-foreground text-2xl font-bold">Input your password</Text>
          <View className="relative">
            <TextInput
              placeholder=" Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              className="text-foreground w-full rounded-xl border border-white/70 px-4 py-2"
            />
            <TouchableOpacity
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <EyeSvg />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text className="text-foreground/70 text-sm">Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        className="bg-accent mx-auto mb-4 flex w-[80vw] flex-row items-center justify-between rounded-full px-4 py-3"
        onPress={() => {
          toast.promise(connect(email, password), {
            loading: 'Connecting...',
            success: (result) => 'Connected!',
            // @ts-expect-error
            error: (error) => error.message,
          });
        }}>
        <Text className="mx-auto text-center text-xl font-bold">Login</Text>
        <View />
      </Button>
    </KeyboardAvoidingView>
  );
}
