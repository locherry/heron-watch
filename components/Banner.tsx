import React from "react";
import { Image } from "react-native";
import Column from "./layout/Column";
import Row from "./layout/Row";
import { H2, H4 } from "./ui/typography";

interface RootViewProps {
  className?: string; // Optional className prop for customization
}

const Banner: React.FC<RootViewProps> = ({ className }) => {
  return (
    <Row className={className + " flex-none"} gap={16}>
      <Image
        style={{ width: 100, height: 100 }}
        source={require("~/assets/images/icon.svg")}
      />
      <Column className="flex-1 justify-start items-start">
        <H2 className="w-full text-left">Heron Watch</H2>
        <H4 className="text-muted-foreground">Stock Management solutions</H4>
      </Column>
    </Row>
  );
};

export default Banner;
