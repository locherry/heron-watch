import { useRouter } from "expo-router";
import { Eye, EyeClosed, Shield, User, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { FontSizeSelect } from "~/components/FontSizeSelect";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "~/components/ui/toggle-group";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

type Role = "ROLE_ADMIN" | "ROLE_USER";
type Theme = "system" | "light" | "dark";
type Language = "EN" | "FR" | "DE" | "EU" | "ES";
type FontSize = "small" | "medium" | "large";

// What the user selects in the UI (single choice)
type RoleSelection = "ROLE_USER" | "ROLE_ADMIN";

// Admin implicitly includes user on the backend
const roleToBackendRoles: Record<RoleSelection, Role[]> = {
  ROLE_USER: ["ROLE_USER"],
  ROLE_ADMIN: ["ROLE_ADMIN", "ROLE_USER"],
};

interface FormState {
  email: string;
  first_name: string;
  last_name: string;
  selectedRole: RoleSelection;
  plainPassword: string;
  preferences: {
    theme: Theme;
    language: Language;
    fontSize: FontSize;
  };
}

interface FormErrors {
  email?: string;
  first_name?: string;
  last_name?: string;
  plainPassword?: string;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      {children}
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View className="border-b border-border pb-2 mb-1">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </Text>
    </View>
  );
}

export default function NewUser() {
  const [t] = useTranslation();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [form, setForm] = useState<FormState>({
    email: "",
    first_name: "",
    last_name: "",
    selectedRole: "ROLE_USER",
    plainPassword: "",
    preferences: {
      theme: "system",
      language: "EN",
      fontSize: "medium",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: createNewUser, isPending } = useFetchMutation(
    "/api/users",
    "post",
    {
      onSuccess: () => router.back(),
    },
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("errors.invalidEmail");
    }
    if (!form.first_name.trim()) {
      newErrors.first_name = t("errors.required");
    }
    if (!form.last_name.trim()) {
      newErrors.last_name = t("errors.required");
    }
    if (!form.plainPassword.trim()) {
      newErrors.plainPassword = t("errors.required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createNewUser({
      body: {
        plainPassword: form.plainPassword,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        roles: roleToBackendRoles[form.selectedRole],
        preferences: form.preferences,
      },
    });
  };

  const setPreference = <K extends keyof FormState["preferences"]>(
    key: K,
    value: FormState["preferences"][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  return (
    <RootView>
      <Header title={capitalizeFirst(t("user.addUser"))} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Identity */}
        <View className="gap-4">
          <SectionTitle>{t("user.identity")}</SectionTitle>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label={capitalizeFirst(t("user.firstName"))}
                error={errors.first_name}
              >
                <Input
                  placeholder={capitalizeFirst(t("user.firstName"))}
                  value={form.first_name}
                  onChangeText={(v) =>
                    setForm((p) => ({ ...p, first_name: v }))
                  }
                  autoCapitalize="words"
                  aria-invalid={!!errors.first_name}
                />
              </FormField>
            </View>
            <View className="flex-1">
              <FormField
                label={capitalizeFirst(t("user.lastName"))}
                error={errors.last_name}
              >
                <Input
                  placeholder={capitalizeFirst(t("user.lastName"))}
                  value={form.last_name}
                  onChangeText={(v) => setForm((p) => ({ ...p, last_name: v }))}
                  autoCapitalize="words"
                  aria-invalid={!!errors.last_name}
                />
              </FormField>
            </View>
          </View>

          <FormField
            label={capitalizeFirst(t("user.email"))}
            error={errors.email}
          >
            <Input
              placeholder={capitalizeFirst(t("user.email"))}
              value={form.email}
              onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
              aria-invalid={!!errors.email}
            />
          </FormField>

          <FormField
            label={capitalizeFirst(t("user.password"))}
            error={errors.plainPassword}
          >
            <Row className="mb-2">
              <Input
                value={form.plainPassword}
                onChangeText={(v) =>
                  setForm((p) => ({ ...p, plainPassword: v }))
                }
                placeholder={capitalizeFirst(t("user.password"))}
                secureTextEntry={!passwordVisible}
              />
              <Button
                variant="ghost"
                className="absolute right-0 text-foreground"
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon as={passwordVisible ? Eye : EyeClosed} />
              </Button>
            </Row>
          </FormField>

          <FormField label={capitalizeFirst(t("user.role"))}>
            {/* Roles */}
            <ToggleGroup
              value={form.selectedRole}
              onValueChange={(v) =>
                v &&
                setForm((p) => ({ ...p, selectedRole: v as RoleSelection }))
              }
              variant="outline"
              type="single"
            >
              {(["ROLE_USER", "ROLE_ADMIN"] as RoleSelection[]).map(
                (role, i) => (
                  <ToggleGroupItem
                    isFirst={i === 0}
                    isLast={i === 1}
                    value={role}
                    key={role}
                  >
                    <ToggleGroupIcon
                      as={role == "ROLE_ADMIN" ? Shield : User}
                    />
                    <Text>{capitalizeFirst(t(`user.${role}`))}</Text>
                  </ToggleGroupItem>
                ),
              )}
            </ToggleGroup>
          </FormField>
        </View>

        {/* Preferences */}
        <View className="gap-4">
          <SectionTitle>{t("user.preferences.preferences")}</SectionTitle>

          <FormField label={capitalizeFirst(t("user.preferences.theme"))}>
            <View className="flex-row gap-2 flex-wrap">
              <ToggleGroup
                value={form.preferences.theme}
                onValueChange={(v) => setPreference("theme", v as Theme)}
                variant="outline"
                type="single"
              >
                {constants.themeOptions.map((theme, i) => (
                  <ToggleGroupItem
                    isFirst={i === 0}
                    isLast={i === 2}
                    value={theme.value}
                    key={theme.value}
                  >
                    <ToggleGroupIcon as={theme.icon} />
                    <Text>
                      {capitalizeFirst(
                        t(`user.preferences.theme_${theme.value}`),
                      )}
                    </Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </View>
          </FormField>

          <FormField label={capitalizeFirst(t("user.preferences.language"))}>
            <Select
              value={constants.languageOptions.find(
                (value) => value.value == form.preferences.language,
              )}
              onValueChange={(v) => setPreference("language", v?.value as "EN")}
            >
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {constants.languageOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label={capitalizeFirst(t("user.preferences.fontSize"))}>
            <FontSizeSelect
              fontSize={form.preferences.fontSize}
              onFontSizeChange={(v) => setPreference("fontSize", v)}
            />
          </FormField>
        </View>

        {/* Actions */}
        <View className="flex-row justify-end gap-3 pt-2 pb-6">
          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={isPending}
          >
            <Text>{capitalizeFirst(t("common.cancel"))}</Text>
          </Button>
          <Button icon={UserPlus} onPress={handleSubmit} disabled={isPending}>
            <Text>{capitalizeFirst(t("user.addUser"))}</Text>
          </Button>
        </View>
      </ScrollView>
    </RootView>
  );
}
