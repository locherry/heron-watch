import { Calendar1 } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { Calendar } from "~/components/Calendar";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { useFormatDate } from "~/lib/hooks/useFormatDate";
import { cn } from "~/lib/utils";

type DateInputProps = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
};

export function DateInput({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  invalid = false,
}: DateInputProps) {
  const formatDate = useFormatDate();
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleDateChange = (raw: unknown) => {
    if (!raw) return;
    const date = raw instanceof Date ? raw : new Date(raw as string);
    if (!isNaN(date.getTime())) {
      onChange(date);
      setCalendarOpen(false);
    }
  };

  const displayValue = value ? formatDate(value.toISOString()) : "";

  return (
    <View className={cn("relative", className)}>
      {/* Styled like Input but pressable — opens the calendar */}
      <Pressable
        disabled={disabled}
        onPress={() => setCalendarOpen((prev) => !prev)}
        className={cn(
          "dark:bg-input/30 border-input bg-background flex h-10 w-full flex-row items-center justify-between rounded-md border px-3 py-1 shadow-sm shadow-black/5",
          disabled && "opacity-50",
          invalid && "border-destructive",
        )}
      >
        <Text
          className={cn(
            "text-base leading-5",
            displayValue ? "text-foreground" : "text-muted-foreground/50",
          )}
        >
          {displayValue || placeholder}
        </Text>
        <Icon as={Calendar1} className="text-muted-foreground" size={16} />
      </Pressable>

      {/* Calendar dropdown */}
      {calendarOpen && (
        <Calendar date={value ?? new Date()} onDateChange={handleDateChange} />
      )}
    </View>
  );
}
