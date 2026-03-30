import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserTheme } from "~/@types/user";
import { FontSizeSelect } from "~/components/FontSizeSelect";
import Header from "~/components/Header";
import Column from "~/components/layout/Column";
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
import { constants } from "~/lib/constants";
import { useApplyUserPreferences } from "~/lib/hooks/useApplyUserPreferences";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

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
  const [fontSizeValue, setFontSizeValue] =
    useState<(typeof constants.fontSizeOptions)[number]["value"]>("medium");

  const [themeValue, setThemeValue] = React.useState<UserTheme>(
    colorScheme ?? "system",
  );

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

  const selectedOption = constants.themeOptions.find(
    (option) => option.value === themeValue,
  );

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.appearance.name"))} />
      <Column gap={16}>
        <Row className="justify-between mb-4">
          <Label>{capitalizeFirst(t("user.preferences.theme"))}</Label>
          <Select
            onValueChange={handleThemeChange}
            defaultValue={
              selectedOption
                ? {
                    value: selectedOption.value,
                    label: capitalizeFirst(
                      t(`user.preferences.theme_${selectedOption.value}`),
                    ),
                  }
                : undefined
            }
          >
            <SelectTrigger>
              <Row gap={8}>
                {selectedOption?.icon && <Icon as={selectedOption.icon} />}
                <Text>
                  {capitalizeFirst(
                    t(
                      `user.preferences.theme_${selectedOption?.value ?? "system"}`,
                    ),
                  )}
                </Text>
              </Row>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {constants.themeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={capitalizeFirst(
                      t(`user.preferences.theme_${option.value}`),
                    )}
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
          <Label>{capitalizeFirst(t("user.preferences.fontSize"))}</Label>
          <FontSizeSelect
            fontSize={fontSizeValue}
            onFontSizeChange={handleFontSizeChange}
          />
        </Row>
      </Column>
    </RootView>
  );
}
