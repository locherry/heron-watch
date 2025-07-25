import { useRouter } from "expo-router"; // For navigation
import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    // Simulate login success
    setError(null);
    router.push("/home/raw_materials"); // Navigate to home after successful login
  };

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg">
        <Text className="text-2xl font-semibold  mb-4 text-center">
          Login
        </Text>

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
        <Button
          onPress={handleLogin}
          variant={"outline"}
        >
          {capitalizeFirst(t("common.login"))}
        </Button>
      </Card>
    </View>
  );
}
