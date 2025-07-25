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
import { capitalizeFirst } from "~/lib/utils";
import i18n from "~/translations/i18n";

// Define Option type
type Option = {
  value: SecureStorageData["userPreferences"]["language"];
  label: string;
};


export default function Language() {
  const LANGUAGES: Option[] = [
    { value: "EN", label: "English" },
    { value: "EU", label: "Euskera" },
    { value: "FR", label: "Français" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<
    (typeof LANGUAGES)[number]["value"] | null
  >(DefaultSecureStorageData["userPreferences"]["language"]);

  useEffect(() => {
    // Fetch user session and update state
    SecureStorage.get("userPreferences").then(
      (prefs) => prefs && setSelectedLanguage(prefs.language)
    );
  }, []);
  const applyLanguageToApp = (languageOption: Option | undefined) => {
    if (languageOption == undefined) {
      return;
    }
    const languageValue = languageOption.value;
    setSelectedLanguage(languageValue);
    SecureStorage.modify("userPreferences", "language", languageValue);
    i18n.changeLanguage(languageValue);

    SecureStorage.get("userSession").then((userSession) => {
      if (userSession) {
        // useFetchQuery(
        //   "/users/[id]",
        //   "PATCH",
        //   {
        //     user_preferences: {
        //       language: languageValue,
        //     },
        //   },
        //   undefined,
        //   { id: userSession.id }
        // ).catch((e) => console.error(e));
      }
    });
  };

  return (
    <RootView>
      <H3 className="mb-3">{capitalizeFirst(t("settings.language.name"))}</H3>
      <Label>{capitalizeFirst(t("settings.language.appLanguage"))}</Label>
      <Select onValueChange={applyLanguageToApp as (option: Option) => void}>
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg flex flex-row items-center"
            placeholder="Select app language"
          ></SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            <SelectLabel>Language</SelectLabel>
            {LANGUAGES.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
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
