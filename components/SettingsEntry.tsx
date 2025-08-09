import { Link, LinkProps } from "expo-router"; // Import Link for navigation and its props type
import type { LucideIcon } from "lucide-react-native"; // Import icon type from lucide-react-native
import React from "react";
import { View } from "react-native";
import { ChevronRight } from "~/lib/icons/ChevronRight"; // Chevron icon to indicate navigation
import { cn } from "~/lib/utils"; // Utility to concatenate class names conditionally
import { Button } from "./ui/button"; // Custom Button component
import { P } from "./ui/typography"; // Custom Paragraph/Text component

// SettingsEntry component props type declaration
const SettingsEntry = ({
  icon: Icon,        // Icon component passed as prop
  title,             // Title text of the entry
  href,              // Optional href for navigation (link)
  onPress,           // Optional onPress callback for button press
}: {
  icon: LucideIcon;
  title: string;
  href?: LinkProps["href"];
  onPress?: () => void;
}) => {
  // Root container className, with flex row, spacing, and hover background for web
  const rootClassName = cn(
    "flex-row items-center justify-between p-4 my-1 hover:bg-muted"
  );

  // Content inside the button/link: icon, title, and right arrow
  const content = (
    <View className="flex-row items-center justify-between flex-1">
      <View className="flex-row items-center">
        {/* Render the icon with size, margin, and stroke width */}
        <Icon size={24} className="mr-3 text-foreground" strokeWidth={1.5} />
        <P>{title}</P> {/* Render the title text */}
      </View>
      {/* Right arrow icon to indicate it's a navigable item */}
      <ChevronRight size={24} className="text-muted-foreground" />
    </View>
  );

  // If href is provided, wrap content inside a Link and Button (for navigation)
  if (href) {
    return (
      <Link href={href} asChild>
        <Button variant={"outline"} className={rootClassName}>
          {content}
        </Button>
      </Link>
    );
  }

  // If onPress callback is provided, render a Button with onPress handler
  if (onPress) {
    return (
      <Button variant={"outline"} className={rootClassName} onPress={onPress}>
        {content}
      </Button>
    );
  }

  // If neither href nor onPress is provided, render a disabled Button
  return (
    <Button variant={"outline"} className={rootClassName} disabled>
      {content}
    </Button>
  );
};

export default SettingsEntry;
