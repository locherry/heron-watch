import { IconSymbolName } from '@/constants/Icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';

type PulsingIconProps = {
  name: IconSymbolName;
  color: string;
  size: number;
  minScale?: number; // e.g. 0.85
  maxScale?: number; // e.g. 1.15
  duration?: number; // e.g. 1000
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

  },
});
