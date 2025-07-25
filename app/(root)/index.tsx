import { useRouter } from "expo-router"; // For navigation
import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function App() {
  const router = useRouter(); // Initialize the router

  const handleLoginPress = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-blue-50">
      {/* Optional: Add an image/logo */}
      {/* <Image
        source={require("~/assets/logo.png")} // Add a logo if you have one
        style={{ width: 120, height: 120, marginBottom: 20 }}
      /> */}
      
      <Text className="text-3xl font-bold text-gray-800 mb-6">Welcome to Heron Watch !</Text>

      <Button
        onPress={handleLoginPress}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-md"
      >
        Login
      </Button>
    </View>
  );
}
