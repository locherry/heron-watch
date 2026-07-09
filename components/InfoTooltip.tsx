import { CircleHelp } from "lucide-react-native";
import { Pressable } from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Pressable hitSlop={8}>
          <Icon as={CircleHelp} size={15} className="text-muted-foreground" />
        </Pressable>
      </TooltipTrigger>
      <TooltipContent className="max-w-[260px]">
        <Text>{text}</Text>
      </TooltipContent>
    </Tooltip>
  );
}
