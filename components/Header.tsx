import { router } from "expo-router";
import { t } from "i18next";
import { ViewProps } from "react-native";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { capitalizeFirst, cn } from "~/lib/utils";
import Row from "./layout/Row";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { H3 } from "./ui/typography";

type HeaderProps = {
  className?: string; // Optional className prop for customization
  title:string;
} & ViewProps;

export default function Header({ className, children, title }: HeaderProps) {
  return (
    <Row className={cn("align-end mb-4", className)} gap={16}>
        <Tooltip>
            <TooltipTrigger>
                      <Button icon={ChevronLeft} onPress={router.back} variant={"outline"} />
            </TooltipTrigger>
            <TooltipContent>
                {capitalizeFirst(t("common.goBack"))}
            </TooltipContent>
        </Tooltip>
      <H3>{title}</H3>
      {children}
    </Row>
  );
}
