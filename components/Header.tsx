import { router } from "expo-router";
import { t } from "i18next";
import { ViewProps } from "react-native";
import { ChevronLeft } from "~/assets/images/icons/ChevronLeft";
import { capitalizeFirst, cn } from "~/lib/utils";
import Row from "./layout/Row";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { H3 } from "./ui/typography";

type HeaderProps = {
  className?: string; // Optional className prop for customization
  title: string;
  onBack?: () => void; // 👈 new optional handler
} & ViewProps;

export default function Header({ className, children, title, onBack }: HeaderProps) {
  return (
    <Row className={cn("align-end mb-4", className)} gap={16}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            icon={ChevronLeft}
            onPress={onBack ?? router.back} // 👈 use custom handler if provided
            variant="outline"
          />
        </TooltipTrigger>
        <TooltipContent>
          <Text>{capitalizeFirst(t("common.goBack"))}</Text>
        </TooltipContent>
      </Tooltip>
      <H3>{title}</H3>
      {children}
    </Row>
  );
}
