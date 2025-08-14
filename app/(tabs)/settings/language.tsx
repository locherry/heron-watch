import { t } from "i18next";
import React, { useEffect, useState } from "react";
import RootView from "~/components/layout/RootView";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { H3 } from "~/components/ui/typography";
import {
  DefaultSecureStorageData,
  SecureStorage,
  SecureStorageData,
} from "~/lib/SecureStorage";
import { useApiMutation } from "~/lib/useApiMutation";
import { capitalizeFirst } from "~/lib/utils";
import i18n from "~/translations/i18n";

// Define Option type
type Option = {
  value: SecureStorageData["userPreferences"]["language"];
  label: string;
};

export default function LanguageSettings() {
  const LANGUAGES: Option[] = [
    { value: "EN", label: "English" },
    { value: "EU", label: "Euskera" },
    { value: "FR", label: "Français" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<
    (typeof LANGUAGES)[number]["value"]
  >(DefaultSecureStorageData["userPreferences"]["language"]);

  const { mutate: updateLanguage } = useApiMutation(
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

  return (
    <RootView>
      <H3 className="mb-3">{capitalizeFirst(t("settings.language.name"))}</H3>
      <Label>{capitalizeFirst(t("settings.language.appLanguage"))}</Label>
      <Select
        defaultValue={LANGUAGES.find(
          (value) => value.value == selectedLanguage
        )}
        value={LANGUAGES.find((value) => value.value == selectedLanguage)}
        onValueChange={(option) =>
          option && applyLanguageToApp(option as Option)
        }
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg flex flex-row items-center"
            placeholder="Select app language"
          />
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            <SelectLabel>Language</SelectLabel>
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
