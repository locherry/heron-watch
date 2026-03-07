import { Portal } from "@rn-primitives/portal";
import { useRef, useState } from "react";
import {
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0, width: 0 });
  const inputRef = useRef<View>(null);
  // Track whether pointer is over the dropdown to prevent onBlur closing it
  const isPointerOverDropdown = useRef(false);

  const openDropdown = () => {
    if (data.length === 0) return;
    inputRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setDropdownPos({ x: px, y: py + height + 4, width });
      setIsOpen(true);
    });
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    isPointerOverDropdown.current = false;
    setIsOpen(false);
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    setTimeout(() => {
      inputRef.current?.measure((_fx, _fy, width, height, px, py) => {
        setDropdownPos({ x: px, y: py + height + 4, width });
        setIsOpen(true);
      });
    }, 0);
  };

  const handleBlur = () => {
    // On web: delay so onPress on a dropdown item can fire first.
    // If pointer is over the dropdown, don't close — the item press will close it.
    if (Platform.OS === "web") {
      setTimeout(() => {
        if (!isPointerOverDropdown.current) setIsOpen(false);
      }, 150);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <View ref={inputRef} style={containerStyle}>
      <Input
        {...rest}
        value={value as string}
        placeholder={placeholder}
        className={className}
        placeholderClassName={placeholderClassName}
        onChangeText={handleChangeText}
        onFocus={openDropdown}
        onBlur={handleBlur}
      />

      {isOpen && data.length > 0 && (
        <Portal name="portalHost">
          {/* Backdrop — only used on native; on web the blur+delay handles dismissal */}
          {Platform.OS !== "web" && (
            <TouchableOpacity
              style={{ position: "absolute", inset: 0, zIndex: 9998 }}
              onPress={() => setIsOpen(false)}
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
            // Web: track pointer entering/leaving the dropdown
            {...(Platform.OS === "web"
              ? {
                  onPointerEnter: () => {
                    isPointerOverDropdown.current = true;
                  },
                  onPointerLeave: () => {
                    isPointerOverDropdown.current = false;
                  },
                }
              : {})}
          >
            {data.map((item, index) => (
              <TouchableOpacity
                key={`ac-${index}`}
                onPress={() => handleSelect(item)}
                className={cn(
                  "px-3 py-2 border-x border-b border-border hover:bg-muted active:bg-muted bg-background",
                  index === 0 && "border-t rounded-t-md",
                  index === data.length - 1 && "rounded-b-md",
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
