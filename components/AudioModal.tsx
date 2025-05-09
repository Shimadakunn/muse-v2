import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Cover from './ui/cover';

import { useAudioPlayer } from '~/store/useAudioPlayer';
import { Audio } from '~/store/useSwipe';

interface AudioModalProps {
  audio: Audio | null;
  visible: boolean;
  onClose: () => void;
}

export default function AudioModal({ audio, visible, onClose }: AudioModalProps) {
  const {
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekAudio,
    isPlaying,
    currentAudio,
    position,
    duration,
  } = useAudioPlayer();

  useEffect(() => {
    if (visible && audio) {
      playAudio(audio);
    }

    return () => {
      if (!visible) {
        stopAudio();
      }
    };
  }, [visible, audio]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  // Format duration to mm:ss
  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audio) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Cover coverUrl={audio.cover_url} size={250} />

          <Text style={styles.title}>{audio.title}</Text>
          <Text style={styles.artist}>Posted by {audio.posted_by_user.username}</Text>

          <View style={styles.controls}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration || 1}
              value={position}
              onSlidingComplete={(value: number) => seekAudio(value)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#555555"
              thumbTintColor="#FFFFFF"
            />

            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => seekAudio(Math.max(0, position - 10000))}>
                <Ionicons name="play-back" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.mainButton} onPress={togglePlay}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => seekAudio(Math.min(duration, position + 10000))}>
                <Ionicons name="play-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
  },
  controls: {
    width: '100%',
    marginTop: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  mainButton: {
    backgroundColor: '#555',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
