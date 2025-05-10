import { Modal, SafeAreaView } from 'react-native';

import Audio from '~/components/AudioCard';
import { Audio as AudioType } from '~/store/useSwipe';

interface AudioModalProps {
  audio: AudioType | null;
  visible: boolean;
  onClose: () => void;
}

export default function AudioModal({ audio, visible, onClose }: AudioModalProps) {
  if (!audio) return null;
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView className="flex-1 items-end justify-end">
        <Audio audio={audio} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
}
