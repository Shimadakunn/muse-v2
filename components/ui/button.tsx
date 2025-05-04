import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { triggerHaptic } from '~/utils/haptics';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
  noShadow?: boolean;
  isWhite?: boolean;
  disabled?: boolean;
  animateBackground?: boolean;
  pressedBackgroundOpacity?: number;
}

export function Button({
  children,
  onPress,
  className,
  noShadow = false,
  disabled = false,
  animateBackground = false,
  pressedBackgroundOpacity = 0.4,
}: ButtonProps) {
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const animatePress = (pressed: boolean) => {
    if (disabled) return;
    setIsPressed(pressed);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: pressed ? 0.98 : 1,
        useNativeDriver: true,
      }),
      Animated.spring(backgroundOpacity, {
        toValue: pressed ? pressedBackgroundOpacity : 0,
        useNativeDriver: true,
        friction: 20,
        tension: 200,
      }),
    ]).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        animatePress(true);
        triggerHaptic('medium');
      }}
      onPressOut={() => {
        animatePress(false);
      }}
      onPress={onPress}>
      <Animated.View
        className={`${disabled ? 'opacity-50' : ''} ${className}`}
        style={{
          transform: [...translate.getTranslateTransform(), { scale }],
          ...(noShadow
            ? {}
            : {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: isPressed ? 0 : 0.25,
                shadowRadius: 6,
                elevation: isPressed ? 0 : 5,
              }),
          ...(animateBackground
            ? {
                backgroundColor: 'transparent',
              }
            : {}),
        }}>
        {animateBackground && (
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'white',
              opacity: backgroundOpacity,
              borderRadius: 30,
            }}
          />
        )}
        {children}
      </Animated.View>
    </Pressable>
  );
}
