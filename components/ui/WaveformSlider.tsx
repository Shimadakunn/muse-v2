import { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';

import { Text } from './text';

import { formatAudioTime } from '~/utils/formatAudioTime';

interface WaveformSliderProps {
  duration: number;
  position: number;
  isPlaying: boolean;
  onSeek: (position: number) => void;
}

export default function WaveformSlider({ duration, position, onSeek }: WaveformSliderProps) {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const screenWidth = Dimensions.get('window').width - 48;

  useEffect(() => {
    const mockData = Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2);
    setWaveformData(mockData);
  }, []);

  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = locationX / screenWidth;
    const newPosition = percentage * duration;
    onSeek(newPosition);
  };

  return (
    <View className="mt-6 w-full px-6">
      <View className="flex-row justify-between">
        <Text className="text-xs text-foreground/80">{formatAudioTime(position)}</Text>
        <Text className="text-xs text-foreground/80">{formatAudioTime(duration)}</Text>
      </View>

      <TouchableOpacity activeOpacity={1} onPress={handlePress} className="h-[50px] justify-center">
        <View className="h-full flex-row items-center justify-between">
          {waveformData.map((height, index) => {
            const barPosition = (index / waveformData.length) * screenWidth;
            const isActive = barPosition <= (position / duration) * screenWidth;

            return (
              <View
                key={index}
                className="mx-[1px] w-[3px] rounded-[2px]"
                style={{
                  height: height * 40,
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}
              />
            );
          })}
        </View>

        <View
          className="absolute h-[40px] w-[4px] rounded-[2px] bg-white"
          style={{ left: (position / duration) * screenWidth }}
        />
      </TouchableOpacity>
    </View>
  );
}
