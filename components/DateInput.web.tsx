import { Portal } from "@rn-primitives/portal";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultClassNames,
} from "react-native-ui-datepicker";
import { buttonVariants } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { capitalizeFirst, cn } from "~/lib/utils";
import { Input } from "./ui/input";

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

// DD/MM/YYYY — swap this + parse/format helpers if you need locale-aware input
const DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

function parseTypedDate(text: string): Date | null {
  const match = text.match(DATE_PATTERN);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatForInput(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

export function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  disabled = false,
  invalid = false,
  disableMobileCalendar = false,
  disableWebCalendar = false,
}: DateInputProps) {
  const [t, i18n] = useTranslation();
  const locale = i18n.language.toLowerCase();
  const defaultClassNames = useDefaultClassNames();

  const [text, setText] = React.useState(value ? formatForInput(value) : "");
  const [parseError, setParseError] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [popoverPos, setPopoverPos] = React.useState({ top: 0, left: 0 });

  // Anchor for the popover is the whole field now, not just the icon —
  // simpler to measure and keeps the popover aligned to the input's left edge.
  const fieldRef = React.useRef<View>(null);

  React.useEffect(() => {
    setText(value ? formatForInput(value) : "");
    setParseError(false);
  }, [value]);

  const commitText = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setParseError(false);
      return;
    }
    const parsed = parseTypedDate(trimmed);
    if (parsed) {
      setParseError(false);
      onChange(parsed);
    } else {
      setParseError(true);
    }
  };

  const openCalendar = () => {
    if (disabled) return;
    if (calendarOpen) {
      setCalendarOpen(false);
      return;
    }
    fieldRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setPopoverPos({ top: py + height + 8, left: px });
      setCalendarOpen(true);
    });
  };

  const handleCalendarSelect = ({ date }: { date: DateType }) => {
    if (!date) return;
    const parsed = date instanceof Date ? date : new Date(date as string);
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
      setText(formatForInput(parsed));
      setParseError(false);
    }
    setCalendarOpen(false);
  };

  const calendarComponents = {
    IconPrev: (
      <View className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <Icon as={ChevronLeft} className="text-foreground" size={18} />
      </View>
    ),
    IconNext: (
      <View className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <Icon as={ChevronRight} className="text-foreground" size={18} />
      </View>
    ),
  };

  return (
    <View ref={fieldRef} className={cn("relative", className)}>
      {/* Input owns all visual chrome — border, bg, height, radius.
          pr-9 reserves room so typed text never runs under the icon. */}
      <Input
        value={text}
        editable={!disabled}
        placeholder={placeholder}
        onChangeText={setText}
        onBlur={() => commitText(text)}
        // @ts-ignore web-only: commit on Enter
        onKeyPress={(e: any) => {
          if (e.nativeEvent?.key === "Enter") commitText(text);
          if (e.nativeEvent?.key === "Escape") setCalendarOpen(false);
        }}
        className={cn("pr-9", (invalid || parseError) && "border-destructive")}
      />

      {/* Icon overlaid on top of the Input, not nested inside it */}
      <Pressable
        disabled={disabled || disableWebCalendar}
        onPress={openCalendar}
        hitSlop={8}
        style={{
          position: "absolute",
          right: 10,
          top: 0,
          bottom: 0,
          justifyContent: "center",
        }}
      >
        <Icon as={Calendar1} className="text-muted-foreground" size={16} />
      </Pressable>

      {parseError && (
        <Text className="text-destructive mt-1 text-xs">
          {capitalizeFirst(t("errors.invalidDate"))}
        </Text>
      )}

      {calendarOpen && !disableWebCalendar && (
        <Portal name="portalHost">
          <Pressable
            onPress={() => setCalendarOpen(false)}
            style={{
              position: "fixed" as any,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
          />
          <View
            style={{
              width: 320,
              position: "absolute",
              top: popoverPos.top,
              left: popoverPos.left,
              zIndex: 50,
            }}
          >
            <DateTimePicker
              components={calendarComponents}
              mode="single"
              date={value ?? new Date()}
              locale={locale}
              onChange={handleCalendarSelect}
              showOutsideDays
              className={cn(
                "bg-background rounded-sm p-2",
                "border-border bg-background dark:border-input border shadow-sm shadow-black/5",
              )}
              classNames={{
                ...defaultClassNames,
                selected: cn(
                  defaultClassNames.selected,
                  "hover:bg-muted-foreground",
                ),
                day: cn(defaultClassNames.day, "hover:bg-muted"),
              }}
            />
          </View>
        </Portal>
      )}
    </View>
  );
}
