import { Portal } from "@rn-primitives/portal"; // Portal system imports
import { Calendar1, ChevronDown } from "lucide-react-native"; // For the button icon
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"; // Full-screen overlay for iOS
import DateTimePicker, {
  DateType,
  useDefaultClassNames
} from "react-native-ui-datepicker"; // The date picker component
import { Button } from "~/components/ui/button"; // Assuming you have this button component
import { Icon } from "~/components/ui/icon"; // Assuming you have this icon component
import { Text } from "~/components/ui/text"; // Assuming you have this text component
import { capitalizeFirst, cn } from "~/lib/utils";

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

type CalendarProps = {
  className?: string;
  date: DateType;
  onDateChange: (date: DateType) => void;
};

export function Calendar({ className, date, onDateChange }: CalendarProps) {
  const [t, i18n] = useTranslation(); // Use translation hook to get translated text
  const locale = i18n.language.toLowerCase()

  const defaultClassNames = useDefaultClassNames();
  const [isPickerVisible, setPickerVisible] = React.useState(false); // Visibility state for the picker
  const buttonRef = React.useRef<View>(null); // Reference to button to track position
  const [buttonPosition, setButtonPosition] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Toggle DateTimePicker visibility
  const toggleDatePicker = () => {
    setPickerVisible(!isPickerVisible);

    // Measure button's position when toggling the picker
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setButtonPosition({ x: px, y: py, width, height });
      });
    }
  };

  // Handle date selection
  const handleDateChange = ({ date }: { date: DateType }) => {
    onDateChange(date);
    setPickerVisible(false); // Close the picker on date selection
  };

  return (
    <View className={cn("relative", className)}>
      {/* Button to trigger DateTimePicker visibility */}
      <Button
        ref={buttonRef}
        onPress={toggleDatePicker}
        variant={"outline"}
        className="flex-row items-center gap-2"
      >
        <Icon as={Calendar1} />
        <Text>{capitalizeFirst(t('Select a date'))}</Text>
        <Icon as={ChevronDown} />
      </Button>

      {/* Render DateTimePicker inside a Portal if it's visible */}
      {isPickerVisible && (
        <Portal name="portalHost">
          <FullWindowOverlay>
            <View
            // className="w-10"
              style={{
                position: "absolute",
                left: buttonPosition.x, // Align to left of the button
                top: buttonPosition.y + buttonPosition.height + 8, // Place just below the button
                ...Platform.select({
                  web:{}, 
                  default:{ right: buttonPosition.x} // For non-web platforms, align to the right 
                })
              }}
            >
              {/* DateTimePicker component */}
              <DateTimePicker
                //https://github.com/farhoudshapouran/react-native-ui-datepicker
                mode="single"
                date={date}
                locale={locale}
                onChange={handleDateChange}
                showOutsideDays={true}
                className={cn(
                  "bg-background rounded-sm p-2",
                  "border-border bg-background dark:border-input border shadow-sm shadow-black/5"
                )}
                classNames={{
                  ...defaultClassNames,
                  selected: cn(
                    defaultClassNames.selected,
                    "hover:bg-muted-foreground"
                  ), // Change background color on hover
                  day: cn(defaultClassNames.day, "hover:bg-muted"), // Change background color on hover
                }}
              />
            </View>
          </FullWindowOverlay>
        </Portal>
      )}
    </View>
  );
}
