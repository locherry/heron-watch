import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ViewProps } from "react-native";
import { useBreakpoint } from "~/lib/hooks/useBreakPoint";
import { capitalizeFirst, cn } from "~/lib/utils";
import Row from "./layout/Row";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type HeaderProps = {
  className?: string; // Optional className prop for customization
  title: string;
  shortTitle?: string; // Shown instead of title on small width devices
  onBack?: () => void;
} & ViewProps;

export default function Header({
  className,
  children,
  title,
  shortTitle,
  onBack,
}: HeaderProps) {
  const [t] = useTranslation();
  const { isSmallWidth } = useBreakpoint();
  const displayTitle = isSmallWidth && shortTitle ? shortTitle : title;

  return (
    <Row className={cn("align-end mb-4", className)}>
      <Row gap={16}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={ChevronLeft}
              onPress={onBack ?? router.back} // use custom handler if provided
              variant="outline"
            />
          </TooltipTrigger>
          <TooltipContent>
            <Text>{capitalizeFirst(t("common.goBack"))}</Text>
          </TooltipContent>
        </Tooltip>
        <Text variant="h3">{displayTitle}</Text>
      </Row>
      {children}
    </Row>
  );
}
