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
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function LoginScreen() {
  const [t] = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
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
    isError: loginIsError,
  } = useFetchQuery(
    "/login",
    "post",
    {},
    { email, password },
    isLoginTriggered, // Only enable this when login is triggered
    { retry: false } // disables retries for login
  );

  if (loginError) {
    console.log(loginError.message);
  }

  React.useEffect(() => {
    console.log(loginError);
    if (loginError) {
      const message =
        loginError?.message || "An unexpected error occurred during login.";
      setError(message);
      setIsLoading(false);
      setIsLoginTriggered(false); // Reset so you can try again
    }
  }, [loginError]);

  React.useEffect(() => {
    if (loginData && loginData.data) {
      setIsLoggedIn(true); // Mark as logged in
      console.log("login successfull");
      const userInfo = loginData.data.user_info;
      const userSession = {
        id: userInfo?.user_id,
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
        router.push("/home");
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
        <Text className="text-2xl font-semibold mb-4 text-center">
          {capitalizeFirst(t("user.login"))}
        </Text>

        {error && (
          <Text className="text-destructive text-sm text-center mb-4">{error}</Text>
        )}

        {/* Email Input */}
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={capitalizeFirst(t("user.email"))}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <Row className="mb-2">
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={capitalizeFirst(t("user.password"))}
            secureTextEntry={!passwordVisible}
          />
          <Button
            variant={"ghost"}
            className="absolute right-0 text-foreground"
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon as={passwordVisible ? Eye : EyeClosed} />
          </Button>
        </Row>

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          disabled={isLoading || loginIsLoading} // Disable button while loading
        >
          {isLoading || loginIsLoading
            ? capitalizeFirst(t("common.loading"))
            : capitalizeFirst(t("user.login"))}
        </Button>
      </Card>
    </View>
  );
}
