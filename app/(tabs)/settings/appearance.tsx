import { t } from "i18next";
import { Laptop } from "lib/icons/Laptop";
import { MoonStar } from "lib/icons/MoonStar";
import { Sun } from "lib/icons/Sun";
import { useColorScheme } from "lib/useColorScheme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { P } from "~/components/ui/typography";
import { SecureStorage } from "~/lib/SecureStorage";
import { useApiMutation } from "~/lib/useApiMutation";
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
  const { mutate: updateTheme } = useApiMutation("/users/{user_ID}", "patch");

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

  const [themeValue, setThemeValue] = React.useState<string>(
    colorScheme ?? "system"
  ); // Default to current system theme

  const handleValueChange = (newValue: SelectOption) => {
    const newThemeValue = newValue?.value ?? "system";
    setThemeValue(newThemeValue);
    if (newValue?.value === "light" || newValue?.value === "dark") {
      setColorScheme(newValue.value); // Update the color scheme based on user selection
      SecureStorage.modify("userPreferences", "theme", newValue.value);
    } else {
      setColorScheme("system"); // Set to system's theme when "system" is selected
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

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.appearance.name"))}></Header>
      <Label>{capitalizeFirst(t("settings.appearance.theme"))}</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={options.find((value) => value.value == themeValue)}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg flex flex-row items-center"
            placeholder="Select Appearance Mode"
          >
            <View className="mr-2 flex flex-row items-center">
              {(() => {
                const selectedOption = options.find(
                  (option) => option.value === themeValue
                );
                if (selectedOption?.icon) {
                  return <selectedOption.icon className="mr-2" size={16} />;
                }
                return null; // If there's no icon, render nothing
              })()}
              <P>
                {options.find((option) => option.value === themeValue)?.label}
              </P>
            </View>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
                icon={option.icon}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </RootView>
  );
}
