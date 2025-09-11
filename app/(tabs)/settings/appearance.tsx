import { t } from "i18next";
import { Laptop, LucideIcon, MoonStar, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { Appearance } from "react-native";
import { userThemeValue } from "~/@types/user";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

// Define Option type
type Option = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type SelectOption =
  | {
      value: string;
      label: string;
    }
  | undefined;

export default function AppearanceSettings() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { mutate: updateTheme } = useFetchMutation("/users/{user_ID}", "patch");

  const options: Option[] = [
    {
      value: "light",
      label: capitalizeFirst(t("settings.appearance.lightTheme")),
      icon: Sun,
    },
    {
      value: "dark",
      label: capitalizeFirst(t("settings.appearance.darkTheme")),
      icon: MoonStar,
    },
    {
      value: "system",
      label: capitalizeFirst(t("settings.appearance.systemDefault")),
      icon: Laptop,
    },
  ];

  const [themeValue, setThemeValue] = React.useState<userThemeValue>(
    colorScheme ?? "system"
  ); // Default to current system theme

  const handleValueChange = (newValue: SelectOption) => {
    const newThemeValue = (newValue?.value ?? "system") as userThemeValue;
    setThemeValue(newThemeValue);

    if (newValue?.value === "light" || newValue?.value === "dark") {
      setColorScheme(newValue.value); // Update the color scheme based on user selection
      SecureStorage.modify("userPreferences", "theme", newValue.value);
    } else {
      const resolvedSystemTheme = Appearance.getColorScheme();
      setColorScheme(resolvedSystemTheme ?? "system"); // Set to system's theme when "system" is selected
      SecureStorage.modify("userPreferences", "theme", "system");
    }

    // Update the theme preference in the database
    SecureStorage.get("userSession").then((userSession) => {
      if (userSession) {
        updateTheme({
          pathParams: { user_ID: userSession.id },
          body: {
            user_preferences: {
              theme: newThemeValue,
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    SecureStorage.get("userPreferences").then((userPreferences) => {
      userPreferences?.theme && setThemeValue(userPreferences?.theme);
    });
  });

  const selectedOption = options.find((option) => option.value === themeValue);
  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.appearance.name"))}></Header>
      <Label>{capitalizeFirst(t("settings.appearance.theme"))}</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={options.find((option) => option.value == themeValue)}
      >
        <SelectTrigger>
          <Row gap={8}>
            {selectedOption?.icon && <Icon as={selectedOption.icon} />}
            <Text>{selectedOption?.label}</Text>
          </Row>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              >
                <Icon as={option.icon} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </RootView>
  );
}
