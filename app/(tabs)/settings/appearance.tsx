import {
  CaseSensitive,
  Laptop,
  LucideIcon,
  MoonStar,
  Sun,
} from "lucide-react-native";
import { rem, useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Appearance } from "react-native";
import { UserTheme } from "~/@types/user";
import Header from "~/components/Header";
import Column from "~/components/layout/Column";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst, cn } from "~/lib/utils";

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
  const [t] = useTranslation();

  const { colorScheme, setColorScheme } = useColorScheme();
  const { mutate: updateAppearance } = useFetchMutation(
    "/api/users/me",
    "patch",
  );

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

  const [themeValue, setThemeValue] = React.useState<UserTheme>(
    colorScheme ?? "system",
  );

  const handleValueChange = (newValue: SelectOption) => {
    const newThemeValue = (newValue?.value ?? "system") as UserTheme;
    setThemeValue(newThemeValue);

    if (newValue?.value === "light" || newValue?.value === "dark") {
      setColorScheme(newValue.value);
      SecureStorage.modify("userPreferences", "theme", newValue.value);
    } else {
      const resolvedSystemTheme = Appearance.getColorScheme();
      setColorScheme(resolvedSystemTheme ?? "system");
      SecureStorage.modify("userPreferences", "theme", "system");
    }

    updateAppearance({
      body: {
        preferences: {
          theme: newThemeValue,
        },
      },
    });
  };

  useEffect(() => {
    SecureStorage.get("userPreferences").then((userPreferences) => {
      userPreferences?.theme && setThemeValue(userPreferences.theme);
    });
  }, []);

  const selectedOption = options.find((option) => option.value === themeValue);

  const [animationEnabled, setAnimationEnabled] = React.useState(true);

  const [fontSizeValue, setFontSizeValue] = React.useState<
    "small" | "medium" | "large"
  >("medium");

  const fontSizeOptions = [
    { value: "small", size: 14, rem: 14 },
    { value: "medium", size: 16, rem: 16 },
    { value: "large", size: 18, rem: 18 },
  ] as const;

  const handleFontSizeChange = (value: "small" | "medium" | "large") => {
    setFontSizeValue(value);
    const option = fontSizeOptions.find((o) => o.value === value);
    if (option) {
      rem.set(option.rem);
      SecureStorage.modify("userPreferences", "fontSize", value);
    }

    updateAppearance({
      body: {
        preferences: {
          fontSize: value,
        },
      },
    });
  };

  useEffect(() => {
    SecureStorage.get("userPreferences").then((userPreferences) => {
      if (userPreferences?.theme) setThemeValue(userPreferences.theme);
      if (userPreferences?.fontSize) {
        const saved = userPreferences.fontSize as "small" | "medium" | "large";
        setFontSizeValue(saved);
        const option = fontSizeOptions.find((o) => o.value === saved);
        if (option) rem.set(option.rem);
      }
    });
  }, []);

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.appearance.name"))}></Header>
      <Column gap={16}>
        <Row className="justify-between mb-4">
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
        </Row>

        <Row className="justify-between">
          <Label>{capitalizeFirst(t("settings.appearance.animations"))}</Label>
          <Switch
            onCheckedChange={setAnimationEnabled}
            checked={animationEnabled}
          />
        </Row>

        <Row className="justify-between">
          <Label>{capitalizeFirst(t("settings.appearance.fontSize"))}</Label>
          <Row gap={16}>
            {fontSizeOptions.map((option) => (
              <Column className="items-center" key={option.value}>
                <Button
                  variant={
                    fontSizeValue === option.value ? "default" : "outline"
                  }
                  style={{
                    height: option.size * 3 - 16,
                    width: option.size * 3 - 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => handleFontSizeChange(option.value)}
                >
                  <Icon
                    as={CaseSensitive}
                    size={(option.size * 3 - 16) * 0.6}
                    className={cn(
                      fontSizeValue === option.value
                        ? "text-background"
                        : "text-foreground",
                    )}
                  />
                </Button>

                <Text style={{ fontSize: option.size }}>
                  {capitalizeFirst(option.value)}
                </Text>
              </Column>
            ))}
          </Row>
        </Row>
      </Column>
    </RootView>
  );
}
