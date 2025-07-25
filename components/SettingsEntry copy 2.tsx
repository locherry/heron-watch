import { Link, LinkProps } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { P } from "./ui/typography";

const SettingsEntry = ({
  icon: Icon,
  title,
  href,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  href?: LinkProps["href"];
  onPress?: () => void;
}) => {
  const rootClassName = cn(
    "flex-row items-center justify-between p-4 my-1 hover:bg-muted"
  );

  const content = (
    <View className="flex-row items-center justify-between flex-1">
      <View className="flex-row items-center">
        <Icon size={24} className="mr-3 text-foreground" strokeWidth={1.5} />
        <P>{title}</P>
      </View>
      <ChevronRight size={24} className="text-muted-foreground" />
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Button variant={"outline"} className={rootClassName}>
          {content}
        </Button>
      </Link>
    );
  }

  if (onPress) {
    return (
      <Button variant={"outline"} className={rootClassName} onPress={onPress}>
        {content}
      </Button>
    );
  }

  return (
    <Button variant={"outline"} className={rootClassName} disabled>
      {content}
    </Button>
  );
};

export default SettingsEntry;
