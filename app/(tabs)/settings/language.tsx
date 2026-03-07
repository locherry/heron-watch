import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import {
  DefaultSecureStorageData,
  SecureStorage,
  SecureStorageData,
} from "~/lib/classes/SecureStorage";
import { useApplyUserPreferences } from "~/lib/hooks/useApplyUserPreferences";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

// Define Option type
type Option = {
  value: SecureStorageData["userSession"]["preferences"]["language"];
  label: string;
};

export default function LanguageSettings() {
  const [t] = useTranslation();

  const LANGUAGES: Option[] = [
    { value: "EN", label: "English" },
    { value: "EU", label: "Euskera" },
    { value: "FR", label: "Français" },
    { value: "DE", label: "Deutsch" },
    { value: "ES", label: "Español" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<
    (typeof LANGUAGES)[number]["value"]
  >(DefaultSecureStorageData["userSession"]["preferences"]["language"]);

  const { mutate: updateLanguage } = useFetchMutation("/api/users/me", "patch");

  useEffect(() => {
    SecureStorage.get("userSession").then(
      (userSession) =>
        userSession && setSelectedLanguage(userSession.preferences.language),
    );
  }, []);
  const { applyPreferences } = useApplyUserPreferences();

  const applyLanguageToApp = (languageOption: Option | undefined) => {
    if (!languageOption) return;

    const languageValue = languageOption.value;
    setSelectedLanguage(languageValue);
    SecureStorage.merge("userSession", {
      preferences: {
        language: languageValue,
      },
    });
    applyPreferences({ language: languageValue });

    SecureStorage.get("userSession").then((userSession) => {
      if (userSession) {
        updateLanguage({
          body: {
            preferences: {
              language: languageValue,
            },
          },
        });
      }
    });
  };

  const selectedOption = LANGUAGES.find(
    (value) => value.value == selectedLanguage,
  );

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.language.name"))}></Header>

      <Label>{capitalizeFirst(t("settings.language.appLanguage"))}</Label>
      <Select
        value={selectedOption}
        onValueChange={(option) =>
          option && applyLanguageToApp(option as Option)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {LANGUAGES.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </RootView>
  );
}
