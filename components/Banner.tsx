import React from "react";
import { Image } from "react-native";
import Column from "./layout/Column";
import Row from "./layout/Row";
import { Text } from "./ui/text";

interface RootViewProps {
  className?: string; // Optional className prop for customization
}

const Banner: React.FC<RootViewProps> = ({ className }) => {
  return (
    <Row className={className + " flex-none"} gap={16}>
      <Image
        style={{ width: 100, height: 100 }}
        source={require("~/assets/images/icon.png")}
      />
      <Column className="flex-1 justify-start items-start">
        <Text variant="h2" className="w-full text-left">Heron Watch</Text>
        <Text variant="h4" className="text-muted-foreground">Stock Management solutions</Text>
      </Column>
    </Row>
  );
};

export default Banner;
