import { CaseSensitive } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { constants } from "~/lib/constants";
import { capitalizeFirst, cn } from "~/lib/utils";
import Column from "./layout/Column";
import Row from "./layout/Row";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

type FontSize = (typeof constants.fontSizeOptions)[number]["value"];

type FontSizeSelectProps = {
  className?: string;
  fontSize?: FontSize;
  onFontSizeChange?: (fontSize: FontSize) => void;
};

export function FontSizeSelect({
  className,
  fontSize,
  onFontSizeChange,
}: FontSizeSelectProps) {
  const [t] = useTranslation();
  return (
    <Row gap={16}>
      {constants.fontSizeOptions.map((option) => (
        <Column className="items-center" key={option.value}>
          <Button
            variant={fontSize === option.value ? "secondary" : "outline"}
            style={{
              height: option.size * 3 - 16,
              width: option.size * 3 - 16,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => onFontSizeChange?.(option.value as FontSize)}
          >
            <Icon
              as={CaseSensitive}
              size={(option.size * 3 - 16) * 0.6}
              className={cn(
                fontSize === option.value
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            />
          </Button>
          <Text
            style={{ fontSize: option.size }}
            className={cn(
              fontSize === option.value
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {capitalizeFirst(option.value)}
          </Text>
        </Column>
      ))}
    </Row>
  );
}
