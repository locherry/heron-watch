import { useRef, useState } from "react";
import { Keyboard, TouchableOpacity, useWindowDimensions } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

type Props<T extends { label: string; value: string }> = {
  data: T[];
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (item: T) => void;
  placeholder?: string;
};

export function AutocompleteInput<T extends { label: string; value: string }>({
  data,
  value,
  onChangeText,
  onSelect,
  placeholder,
}: Props<T>) {
  const { width } = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(true);
  const isSelecting = useRef(false);

  return (
    <Autocomplete
      inputContainerStyle={{ borderWidth: 0 }}
      containerStyle={{ width: width / 5 }}
      hideResults={isFocused}
      onBlur={() => {
        setTimeout(() => {
          Keyboard.dismiss();
          if (!isFocused && !isSelecting.current) {
            setIsFocused(true);
          } else {
            isSelecting.current = false;
          }
        }, 100);
      }}
      onFocus={() => setIsFocused(false)}
      data={!isFocused ? data : []}
      value={value}
      onChangeText={onChangeText}
      renderTextInput={(props) => (
        <Input {...props} placeholder={placeholder} />
      )}
      flatListProps={{
        style: {
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor: "transparent",
          borderRadius: 6,
        },
        keyExtractor: (_item: unknown, index: number) => `ac-${index}`,
        renderItem: ({ item, index }: { item: unknown; index: number }) => {
          const typed = item as T;
          const isFirst = index === 0;
          const isLast = index === data.length - 1;
          return (
            <TouchableOpacity
              className={`flex-row justify-center border bg-background border-muted hover:bg-muted
                ${isFirst ? "rounded-t-md" : ""}
                ${isLast ? "rounded-b-md" : ""}
              `}
              onPressIn={() => (isSelecting.current = true)}
              onPress={() => {
                onSelect(typed);
                setIsFocused(true);
              }}
            >
              <Text>{typed.label}</Text>
            </TouchableOpacity>
          );
        },
      }}
    />
  );
}
