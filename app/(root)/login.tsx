import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router"; // For navigation
import { Eye, EyeClosed } from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
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
import { capitalizeFirst } from "~/lib/utils";

export default function LoginScreen() {
  const [t] = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const { mutate: login, isPending } = useMutation({
    mutationFn: () =>
      apiFetch("/api/login", "post", undefined, {
        username: email,
        password,
      }),

    onSuccess: async (data) => {
      // Save token first so apiFetch can use it for the /me request
      await SecureStorage.set("userSession", {
        ...DefaultSecureStorageData.userSession,
        jwt: data.token,
      });

      // Fetch user info
      const me = await apiFetch("/api/me", "get");

      // Save complete session
      await SecureStorage.set("userSession", {
        jwt: data.token,
        id: me.id ?? DefaultSecureStorageData.userSession.id,
        firstName: me.first_name,
        lastName: me.last_name,
        email: me.email,
        roles: me.roles ?? DefaultSecureStorageData.userSession.roles,
      });

      router.push("/home");
    },

    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError(capitalizeFirst(t("errors.fillBothFields")));
      return;
    }
    setError(null);
    login();
  };

  return (
    <View className="flex-1 justify-center items-center p-6">
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
          <Text>
            {isPending
              ? capitalizeFirst(t("common.loading"))
              : capitalizeFirst(t("user.login"))}
          </Text>
        </Button>
      </Card>
    </View>
  );
}
