import * as TabsPrimitive from "@rn-primitives/tabs";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { Animated, Easing, LayoutChangeEvent, Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "./text";

const MaterialTabs = TabsPrimitive.Root;

function MaterialTabsList({
  className,
  children,
  ...props
}: TabsPrimitive.ListProps & {
  ref?: React.RefObject<TabsPrimitive.ListRef>;
  children: React.ReactNode;
}) {
  const { value } = TabsPrimitive.useRootContext();

  const [tabLayouts, setTabLayouts] = React.useState<
    Record<string, { x: number; width: number }>
  >({});
  const underlineLeft = React.useRef(new Animated.Value(0)).current;
  const underlineWidth = React.useRef(new Animated.Value(0)).current;

  // Animate underline whenever active tab changes
  React.useEffect(() => {
    if (tabLayouts[value]) {
      Animated.parallel([
        Animated.timing(underlineLeft, {
          toValue: tabLayouts[value].x,
          duration: 250,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        Animated.timing(underlineWidth, {
          toValue: tabLayouts[value].width,
          duration: 250,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [value, tabLayouts]);

  // Wrap each child to measure its layout
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const tabChild = child as React.ReactElement<any>;
    const tabValue = tabChild.props.value;

    return React.cloneElement(tabChild, {
      onLayout: (e: LayoutChangeEvent) => {
        const layout = e.nativeEvent.layout;
        setTabLayouts((prev) => ({
          ...prev,
          [tabValue]: { x: layout.x, width: layout.width },
        }));
        if (tabChild.props.onLayout) tabChild.props.onLayout(e);
      },
    });
  });

  const {colorScheme} = useColorScheme();

  return (
    <TabsPrimitive.List className={cn("flex-row border-muted border-b",className)} {...props}>
      {wrappedChildren}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: underlineLeft,
          height: 2,
          width: underlineWidth,
          backgroundColor: colorScheme == "light" ? "black" : "white",
          borderRadius: 1,
        }}
      />
    </TabsPrimitive.List>
  );
}

function MaterialTabsTrigger({ children, ...props }: any) {
  const content =
    typeof children === "function" ? children({ pressed: false }) : children;

  return (
    <TabsPrimitive.Trigger {...props} asChild>
      <Pressable
        className={cn(
          "items-center justify-center px-4 pb-2"
        )}
      >
        <Text className={cn("text-xl font-bold")}>{content}</Text>
      </Pressable>
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
        className
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

