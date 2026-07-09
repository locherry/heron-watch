import { Link, router } from "expo-router";
import { ChevronLeft, CompassIcon } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();
  const canGoBack = router.canGoBack();

  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(-12, {
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.System,
        }),
        withTiming(12, {
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.System,
        }),
      ),
      -1,
      true,
    );
  }, [rotate]);

  const compassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View className="flex-1 items-center justify-center gap-8 px-6 bg-background">
      <View className="items-center gap-6">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-accent">
          <Animated.View style={compassStyle}>
            <Icon as={CompassIcon} size={72} className="text-primary" />
          </Animated.View>
        </View>

        <View className="items-center gap-2">
          <Text className="text-6xl font-extrabold tracking-tight text-primary">
            404
          </Text>
          <Text className="text-xl font-bold text-foreground">
            {capitalizeFirst(t("errors.notFoundTitle"))}
          </Text>
          <Text className="text-center text-muted-foreground max-w-xs">
            {t("errors.notFoundDescription")}
          </Text>
        </View>
      </View>

      <Row gap={12}>
        <Button
          variant="outline"
          onPress={() => router.back()}
          disabled={!canGoBack}
        >
          <Icon as={ChevronLeft} />
          <Text>{capitalizeFirst(t("common.goBack"))}</Text>
        </Button>

        <Link asChild href="/home">
          <Button>
            <Text>{capitalizeFirst(t("common.goHome"))}</Text>
          </Button>
        </Link>
      </Row>
    </View>
  );
}
