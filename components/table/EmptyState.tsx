import { PackageOpen } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

export default function EmptyState({
  width,
  title,
  description,
}: {
  width?: number;
  title: string;
  description: string;
}) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, {
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.System,
        }),
        withTiming(0, {
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.System,
        }),
      ),
      -1,
      true,
    );
  }, [translateY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      style={{ width }}
      className="items-center justify-center gap-4 py-16 px-6"
    >
      <View className="h-20 w-20 items-center justify-center rounded-full bg-accent">
        <Animated.View style={floatStyle}>
          <Icon as={PackageOpen} size={36} className="text-muted-foreground" />
        </Animated.View>
      </View>
      <View className="items-center gap-1">
        <Text className="font-bold text-foreground">{title}</Text>
        <Text className="text-center text-muted-foreground max-w-xs">
          {description}
        </Text>
      </View>
    </View>
  );
}
