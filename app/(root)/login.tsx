import { useRouter } from "expo-router"; // For navigation
import { Eye, EyeClosed } from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { apiFetch } from "~/lib/apiClient";
import {
  DefaultSecureStorageData,
  SecureStorage,
} from "~/lib/classes/SecureStorage";
import { useApplyUserPreferences } from "~/lib/hooks/useApplyUserPreferences";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function LoginScreen() {
  const [t] = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { applyPreferences } = useApplyUserPreferences();

  const { mutate: login, isPending } = useFetchMutation("/api/login", "post", {
    onSuccess: async (data) => {
      await SecureStorage.set("userSession", {
        ...DefaultSecureStorageData.userSession,
        jwt: data.token,
      });

      const me = await apiFetch("/api/users/me", "get");

      const preferences = {
        fontSize:
          me.preferences?.fontSize ??
          DefaultSecureStorageData.userSession.preferences.fontSize,
        language:
          me.preferences?.language ??
          DefaultSecureStorageData.userSession.preferences.language,
        theme:
          me.preferences?.theme ??
          DefaultSecureStorageData.userSession.preferences.theme,
      };

      await SecureStorage.set("userSession", {
        jwt: data.token,
        id: me.id ?? DefaultSecureStorageData.userSession.id,
        firstName:
          me.first_name ?? DefaultSecureStorageData.userSession.firstName,
        lastName: me.last_name ?? DefaultSecureStorageData.userSession.lastName,
        email: me.email ?? DefaultSecureStorageData.userSession.email,
        roles: me.roles ?? DefaultSecureStorageData.userSession.roles,
        preferences: preferences,
      });

      await applyPreferences(preferences);

      router.push("/home");
    },
    onError: (err) => setError(err.message),
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError(capitalizeFirst(t("errors.fillBothFields")));
      return;
    }

    setError(null);

    login({
      body: {
        username: email,
        password,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior="padding"
    >
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg">
        <Text className="text-2xl font-semibold mb-4 text-center">
          {capitalizeFirst(t("user.login"))}
        </Text>

        {error && (
          <Text className="text-destructive text-sm text-center mb-4">
            {error}
          </Text>
        )}

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={capitalizeFirst(t("user.email"))}
          keyboardType="email-address"
        />

        <Row className="mb-2">
          <Input
            value={password}
            onChangeText={setPassword}
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

        <Button onPress={handleLogin} disabled={isPending}>
          {isPending ? (
            <>
              <ActivityIndicator color={"#000"} />
              <Text>{capitalizeFirst(t("common.loading"))}</Text>
            </>
          ) : (
            <Text>{capitalizeFirst(t("user.login"))}</Text>
          )}
        </Button>
      </Card>
    </KeyboardAvoidingView>
  );
}
