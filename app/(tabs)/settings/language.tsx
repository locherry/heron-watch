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
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";
import i18n from "~/translations/i18n";

// Define Option type
type Option = {
  value: SecureStorageData["userPreferences"]["language"];
  label: string;
};

export default function LanguageSettings() {
  const [t] = useTranslation();

  const LANGUAGES: Option[] = [
    { value: "EN", label: "English" },
    { value: "EU", label: "Euskera" },
    { value: "FR", label: "Français" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<
    (typeof LANGUAGES)[number]["value"]
  >(DefaultSecureStorageData["userPreferences"]["language"]);

  const { mutate: updateLanguage } = useFetchMutation(
    "/users/{user_ID}",
    "patch"
  );

  useEffect(() => {
    SecureStorage.get("userPreferences").then(
      (prefs) => prefs && setSelectedLanguage(prefs.language)
    );
  }, []);

  const applyLanguageToApp = (languageOption: Option | undefined) => {
    if (!languageOption) return;

    const languageValue = languageOption.value;
    setSelectedLanguage(languageValue);
    SecureStorage.modify("userPreferences", "language", languageValue);
    i18n.changeLanguage(languageValue);

    SecureStorage.get("userSession").then((userSession) => {
      if (userSession) {
        updateLanguage({
          pathParams: { user_ID: userSession.id },
          body: {
            user_preferences: {
              language: languageValue,
            },
          },
        });
      }
    });
  };

  const selectedOption = LANGUAGES.find(
    (value) => value.value == selectedLanguage
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
