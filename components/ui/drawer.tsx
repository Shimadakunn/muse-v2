import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface DrawerProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  isBlack?: boolean;
  style?: ViewStyle;
}

const CLOSE_THRESHOLD = 0.2;
const VELOCITY_THRESHOLD = 0.5;

const Drawer: React.FC<DrawerProps> = ({
  isVisible,
  onClose,
  children,
  height = Dimensions.get('window').height * 0.9,
  isBlack = false,
  style,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newPosition = Math.max(0, gestureState.dy);
        translateY.setValue(newPosition);
        // Fade overlay based on drawer position
        const newOpacity = 1 - newPosition / height;
        overlayOpacity.setValue(newOpacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        const draggedDistance = gestureState.dy;
        const dragPercentage = draggedDistance / height;
        const shouldClose =
          dragPercentage > CLOSE_THRESHOLD || gestureState.vy > VELOCITY_THRESHOLD;

        if (shouldClose) {
          closeDrawer();
        } else {
          // Snap back to open position
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              damping: 10,
              stiffness: 100,
              mass: 0.25,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const closeDrawer = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 10,
          stiffness: 100,
          mass: 0.25,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.drawer,
          {
            height,
            transform: [{ translateY }],
            backgroundColor: isBlack ? '#000000' : 'white',
          },
          style,
        ]}>
        <View style={styles.handle} />
        <SafeAreaView className="flex-1">{children}</SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingTop: 25,
  },
  handle: {
    position: 'absolute',
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
    top: 12,
    left: '50%',
    zIndex: 1,
  },
});

export default Drawer;
