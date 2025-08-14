import { router } from "expo-router";
import { ViewProps } from "react-native";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { cn } from "~/lib/utils";
import Row from "./layout/Row";
import { Button } from "./ui/button";
import { H3 } from "./ui/typography";

type HeaderProps = {
  className?: string; // Optional className prop for customization
  title:string;
} & ViewProps;

export default function Header({ className, children, title }: HeaderProps) {
  return (
    <Row className={cn("align-end mb-4", className)} gap={16}>
      <Button icon={ChevronLeft} onPress={router.back} variant={"outline"} />
      <H3>{title}</H3>
      {children}
    </Row>
  );
}
