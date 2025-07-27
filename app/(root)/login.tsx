import { useRouter } from "expo-router"; // For navigation
import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { SecureStorage } from "~/lib/SecureStorage";
import { useFetchQuery } from "~/lib/useFetchQuery"; // Import your custom hook
import { capitalizeFirst } from "~/lib/utils";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Track if login is successful
  const [isLoginTriggered, setIsLoginTriggered] = React.useState(false); // Track if login is triggered

  const router = useRouter();

  // Use the useFetchQuery hook but only trigger it when login is triggered
  const {
    data: loginData,
    error: loginError,
    isLoading: loginIsLoading,
  } = useFetchQuery(
    "/login",
    "post",
    undefined,
    { email, password },
    isLoginTriggered // Only enable this when login is triggered
  );

  React.useEffect(() => {
    if (loginData && loginData.data) {
      setIsLoggedIn(true); // Mark as logged in
      console.log("login successfull")
      const userInfo = loginData.data.user_info;
      const userSession = {
        id: userInfo?.id,
        username: userInfo?.username,
        firstName: userInfo?.first_name,
        lastName: userInfo?.last_name,
        email: userInfo?.email,
        role: userInfo?.role,
        jwt: loginData.data?.jwt,
      };
      const userPreferences = {
        language: loginData.data.user_preferences?.language,
        theme: loginData.data.user_preferences?.theme,
      };
      const allDefined =
        Object.values(userSession).every((value) => value !== undefined) &&
        Object.values(userPreferences).every((value) => value !== undefined);
      if (allDefined) {
        SecureStorage.set(
          "userSession",
          userSession as {
            id: number;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            jwt: string;
            role: "admin" | "user";
          }
        );
        SecureStorage.set(
          "userPreferences",
          userPreferences as {
            theme: "dark" | "light" | "system";
            language: "EN" | "FR" | "EU";
          }
        );
        // Store user info and then :
        router.push("/home/finished_products");
      }
    }
  }, [loginData, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsLoginTriggered(true); // Trigger the login request when the button is pressed
  };

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg">
        <Text className="text-2xl font-semibold mb-4 text-center">Login</Text>

        {error && (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        )}

        {/* Email Input */}
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={capitalizeFirst(t("common.email"))}
          className="mb-4"
          keyboardType="email-address"
        />

        {/* Password Input */}
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder={capitalizeFirst(t("common.password"))}
          secureTextEntry
          className="mb-6"
        />

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          variant={"outline"}
          disabled={isLoading || loginIsLoading} // Disable button while loading
        >
          {isLoading || loginIsLoading
            ? capitalizeFirst(t("common.loading"))
            : capitalizeFirst(t("common.login"))}
        </Button>
      </Card>
    </View>
  );
}
