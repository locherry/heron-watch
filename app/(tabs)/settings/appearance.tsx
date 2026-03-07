import {
  CaseSensitive,
  Laptop,
  LucideIcon,
  MoonStar,
  Sun,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { constants } from "~/lib/constants";
import { useApplyUserPreferences } from "~/lib/hooks/useApplyUserPreferences";
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
  const { colorScheme } = useColorScheme();
  const { mutate: updateAppearance } = useFetchMutation(
    "/api/users/me",
    "patch",
  );
  const { applyPreferences } = useApplyUserPreferences();
  const [fontSizeValue, setFontSizeValue] = useState("medium");

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
  const [animationEnabled, setAnimationEnabled] = React.useState(true);

  // Load saved preferences on mount via the shared hook
  useEffect(() => {
    applyPreferences();
    SecureStorage.get("userSession").then((userSession) => {
      if (userSession?.preferences?.theme) {
        setThemeValue(userSession.preferences.theme);
      }
    });
  }, []);

  const handleThemeChange = (newValue: SelectOption) => {
    const newTheme = (newValue?.value ?? "system") as UserTheme;
    setThemeValue(newTheme);
    SecureStorage.merge("userSession", { preferences: { theme: newTheme } });
    applyPreferences({ theme: newTheme });
    updateAppearance({ body: { preferences: { theme: newTheme } } });
  };

  const handleFontSizeChange = (value: "small" | "medium" | "large") => {
    setFontSizeValue(value);
    SecureStorage.merge("userSession", { preferences: { fontSize: value } });
    applyPreferences({ fontSize: value });
    updateAppearance({ body: { preferences: { fontSize: value } } });
  };

  const selectedOption = options.find((option) => option.value === themeValue);

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.appearance.name"))} />
      <Column gap={16}>
        <Row className="justify-between mb-4">
          <Label>{capitalizeFirst(t("settings.appearance.theme"))}</Label>
          <Select
            onValueChange={handleThemeChange}
            defaultValue={options.find((option) => option.value === themeValue)}
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
            {constants.fontSizeOptions.map((option) => (
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
