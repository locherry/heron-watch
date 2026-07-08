import * as TabsPrimitive from "@rn-primitives/tabs";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { LayoutChangeEvent, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { Text } from "./text";

type TabLayout = { x: number; width: number };

const MaterialTabs = TabsPrimitive.Root;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// underline motion
const UNDERLINE_SPRING = { damping: 5, stiffness: 100, mass: 0.2 };
// press feedback
const PRESS_SPRING = { damping: 50, stiffness: 300 };

function MaterialTabsList({
  className,
  children,
  ...props
}: TabsPrimitive.ListProps & {
  ref?: React.RefObject<TabsPrimitive.ListRef>;
  children: React.ReactNode;
}) {
  const { value } = TabsPrimitive.useRootContext();
  const { colorScheme } = useColorScheme();

  const tabLayouts = React.useRef<Record<string, TabLayout>>({});
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);
  const hasMeasured = useSharedValue(false);

  const measureTab = React.useCallback(
    (tabValue: string, layout: TabLayout) => {
      tabLayouts.current[tabValue] = layout;
      if (tabValue === value) {
        if (hasMeasured.value) {
          underlineX.value = withSpring(layout.x, UNDERLINE_SPRING);
          underlineWidth.value = withSpring(layout.width, UNDERLINE_SPRING);
        } else {
          underlineX.value = layout.x;
          underlineWidth.value = layout.width;
          hasMeasured.value = true;
        }
      }
    },
    [value],
  );

  React.useEffect(() => {
    const layout = tabLayouts.current[value];
    if (layout) {
      underlineX.value = withSpring(layout.x, UNDERLINE_SPRING);
      underlineWidth.value = withSpring(layout.width, UNDERLINE_SPRING);
    }
  }, [value]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
    width: underlineWidth.value,
  }));

  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const tabChild = child as React.ReactElement<any>;
    const tabValue = tabChild.props.value;

    return React.cloneElement(tabChild, {
      onLayout: (e: LayoutChangeEvent) => {
        const { x, width } = e.nativeEvent.layout;
        measureTab(tabValue, { x, width });
        tabChild.props.onLayout?.(e);
      },
    });
  });

  return (
    <TabsPrimitive.List
      className={cn("flex-row gap-4 border-muted border-b", className)}
      {...props}
    >
      {wrappedChildren}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            borderRadius: 1,
            backgroundColor: colorScheme === "light" ? "black" : "white",
          },
          underlineStyle,
        ]}
      />
    </TabsPrimitive.List>
  );
}

function MaterialTabsTrigger({
  children,
  className,
  disabled = false,
  value,
  ...props
}: TabsPrimitive.TriggerProps & {
  ref?: React.RefObject<TabsPrimitive.TriggerRef>;
  className?: string;
}) {
  const { value: currentValue } = TabsPrimitive.useRootContext();
  const isActive = currentValue === value;

  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, PRESS_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
  };

  return (
    <TabsPrimitive.Trigger value={value} disabled={disabled} asChild {...props}>
      <AnimatedPressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={cn(
          "items-center justify-center sm:px-4 pb-2",
          disabled ? "opacity-40" : "opacity-100",
          className,
        )}
        style={pressStyle}
      >
        <Text
          className={cn(
            "text-xl font-bold",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {typeof children === "function"
            ? children({ pressed: false, hovered: false })
            : children}
        </Text>
      </AnimatedPressable>
    </TabsPrimitive.Trigger>
  );
}

function MaterialTabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & {
  ref?: React.RefObject<TabsPrimitive.ContentRef>;
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "pt-4 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
      {...props}
    />
  );
}

export {
  MaterialTabs,
  MaterialTabsContent,
  MaterialTabsList,
  MaterialTabsTrigger
};

