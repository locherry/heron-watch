import { Link, LinkProps } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Card } from "./ui/card";
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
  const Content = () => (
    <Card className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center">
        <Icon size={24} className="mr-3 text-foreground" strokeWidth={1.5} />
        <P>{title}</P>
      </View>
      <ChevronRight size={24} className="text-muted-foreground" />
    </Card>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable>
          <Content />
        </Pressable>
      </Link>
    );
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <Content />
      </Pressable>
    );
  }

  return <Content />;
};

export default SettingsEntry;
