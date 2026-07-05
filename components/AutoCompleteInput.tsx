import { Portal } from "@rn-primitives/portal";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { measure, useAnimatedRef } from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

type Props<T extends { label: string; value: string }> = TextInputProps &
  React.RefAttributes<TextInput> & {
    data: T[];
    onSelect: (item: T) => void;
    containerStyle?: import("react-native").ViewStyle;
  };

export function AutocompleteInput<T extends { label: string; value: string }>({
  data,
  value,
  onChangeText,
  onSelect,
  placeholder,
  className,
  placeholderClassName,
  containerStyle,
  ...rest
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{
    x: number;
    y: number;
    width: number;
  } | null>(null);
  // Index of the keyboard-highlighted option, -1 = none highlighted.
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const animatedInputRef = useAnimatedRef<View>();
  const isPointerOverDropdown = useRef(false);

  const applyMeasurement = (pos: { x: number; y: number; width: number }) => {
    setDropdownPos(pos);
    setIsOpen(true);
  };

  const updateDropdownPosition = () => {
    "worklet";
    const m = measure(animatedInputRef);
    if (m === null) return;
    scheduleOnRN(applyMeasurement, {
      x: m.pageX,
      y: m.pageY + m.height + 4,
      width: m.width,
    });
  };

  const openDropdown = () => {
    if (data.length === 0) return;
    scheduleOnUI(updateDropdownPosition);
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    setHighlightedIndex(-1);
    scheduleOnUI(updateDropdownPosition);
  };

  const closeDropdown = () => {
    isPointerOverDropdown.current = false;
    setIsOpen(false);
    setDropdownPos(null);
    setHighlightedIndex(-1);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    closeDropdown();
  };

  const handleBlur = () => {
    if (Platform.OS === "web") {
      setTimeout(() => {
        if (!isPointerOverDropdown.current) closeDropdown();
      }, 150);
    } else {
      closeDropdown();
    }
  };

  // Web keyboard navigation: ArrowDown/ArrowUp move the highlight,
  // Enter commits the highlighted item, Escape dismisses.
  useEffect(() => {
    if (Platform.OS !== "web" || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % data.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? data.length - 1 : prev - 1,
          );
          break;
        case "Enter": {
          const item = data[highlightedIndex];
          if (highlightedIndex >= 0 && item) {
            e.preventDefault();
            handleSelect(item);
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // capture = true
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, data, highlightedIndex]);

  return (
    <View ref={animatedInputRef} style={containerStyle}>
      <Input
        {...rest}
        value={value as string}
        placeholder={placeholder}
        className={className}
        placeholderClassName={placeholderClassName}
        onChangeText={handleChangeText}
        onFocus={openDropdown}
        onBlur={handleBlur}
        {...(Platform.OS === "web"
          ? {
              role: "combobox" as const,
              "aria-expanded": isOpen,
              "aria-autocomplete": "list" as const,
              "aria-activedescendant":
                highlightedIndex >= 0
                  ? `ac-option-${highlightedIndex}`
                  : undefined,
            }
          : {})}
      />

      {isOpen && dropdownPos && data.length > 0 && (
        <Portal name="portalHost">
          {Platform.OS !== "web" && (
            <TouchableOpacity
              style={{ position: "absolute", inset: 0, zIndex: 9998 }}
              onPress={closeDropdown}
              activeOpacity={1}
            />
          )}
          <View
            style={{
              position: "absolute",
              left: dropdownPos.x,
              top: dropdownPos.y,
              width: dropdownPos.width,
              zIndex: 9999,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                },
                android: { elevation: 8 },
              }),
            }}
            {...(Platform.OS === "web"
              ? ({
                  role: "listbox",
                  onPointerEnter: () => {
                    isPointerOverDropdown.current = true;
                  },
                  onPointerLeave: () => {
                    isPointerOverDropdown.current = false;
                  },
                } as any)
              : {})}
          >
            {data.map((item, index) => (
              <TouchableOpacity
                key={`ac-${index}`}
                onPress={() => handleSelect(item)}
                {...(Platform.OS === "web"
                  ? {
                      nativeID: `ac-option-${index}`,
                      role: "option" as const,
                      "aria-selected": index === highlightedIndex,
                    }
                  : {})}
                className={cn(
                  "px-3 py-2 border-x border-b border-border hover:bg-muted active:bg-muted bg-background",
                  index === 0 && "border-t rounded-t-md",
                  index === data.length - 1 && "rounded-b-md",
                  index === highlightedIndex && "bg-muted",
                )}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Portal>
      )}
    </View>
  );
}
