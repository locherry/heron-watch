import { Link, LinkProps } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { cn } from "~/lib/utils";
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
  )
  const Content = () => (
    <>
      <View className="flex-row items-center">
        <Icon size={24} className="mr-3 text-foreground" strokeWidth={1.5} />
        <P>{title}</P>
      </View>
      <ChevronRight size={24} className="text-muted-foreground absolute right-3" />
    </>
  );

  if (href) {
    return (
      <Link href={href} asChild className={rootClassName}>
        <Pressable>
          <Content />
        </Pressable>
      </Link>
    );
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={rootClassName}>
        <Content />
      </Pressable>
    );
  }

  return <Content />;
};

export default SettingsEntry;
