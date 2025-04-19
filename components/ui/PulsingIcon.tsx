import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  withRepeat,
  useDerivedValue,
  useAnimatedProps
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';
import { IconSymbolName } from '@/constants/Icons';

type PulsingIconProps = {
  name: IconSymbolName;
  color: string;
  size: number;
  minScale?: number; // e.g. 0.85
  maxScale?: number; // e.g. 1.15
  duration?: number; // e.g. 900
};

export const PulsingIcon: React.FC<PulsingIconProps> = ({
  name,
  color,
  size,
  minScale = 0.85,
  maxScale = 1.15,
  duration = 1000,
}) => {
  const scaleAnim = useSharedValue(minScale);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  React.useEffect(() => {
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(minScale, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite loop
      true // Reverse the sequence on repeat
    );
  }, [minScale, maxScale, duration]);

  return (
    <Animated.View style={[animatedStyle, styles.iconContainer]}>
      <IconSymbol name={name} color={color} size={size} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    // Add any additional styles for the icon container here
  },
});
