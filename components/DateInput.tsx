import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar1 } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
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
  disableMobileCalendar?: boolean;
  disableWebCalendar?: boolean;
};

export function DateInput({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  invalid = false,
  disableMobileCalendar = false,
  disableWebCalendar = false,
}: DateInputProps) {
  const formatDate = useFormatDate();
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const displayValue = value ? formatDate(value.toISOString()) : "";

  return (
    <View className={cn("relative", className)}>
      <Pressable
        disabled={disabled}
        onPress={() => setPickerOpen(true)}
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

      {pickerOpen && !disableMobileCalendar && (
        <DateTimePicker
          mode="date"
          value={value ?? new Date()}
          onChange={(_event, selectedDate) => {
            setPickerOpen(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}
