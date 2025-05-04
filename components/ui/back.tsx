import { router } from 'expo-router';

import { Button } from './button';

import BackSVG from '~/assets/svg/back.svg';

export function Back() {
  return (
    <Button onPress={() => router.back()}>
      <BackSVG />
    </Button>
  );
}
