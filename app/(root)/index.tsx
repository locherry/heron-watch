import { useRouter } from "expo-router"; // For navigation
import { Megaphone, RefreshCcw, ServerCrash } from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import Banner from "~/components/Banner";
import Column from "~/components/layout/Column";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";
export default function App() {
  const [t] = useTranslation()
  const router = useRouter(); // Initialize the router

  const handleLoginPress = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <>
      <View className="flex-1 items-center justify-center p-4 m-4">
        <Banner className="mb-8 sm:w-[400px]" />
        {/* Features Section */}
        <Card className="w-full max-w-[400px] mb-6 p-4">
          <Text variant="h4" className="text-xl font-semibold mb-3">
            {t("Your all in one solution for:")}
          </Text>
          <Row className="">
            <Column className="h-full items-center w-1/3">
              <Icon as={RefreshCcw} size={20}/>
              <Text variant="p" className="mt-2 text-center">
                {t("Real-Time Tracking")}
              </Text>
            </Column>
            <Column className="h-full items-center w-1/3">
              <Icon as={Megaphone} size={20}/>
              <Text variant="p" className="mt-2 text-center">
                {t("Inventory Alerts")}
              </Text>
            </Column>
            <Column className="h-full items-center w-1/3">
              <Icon as={ServerCrash} size={20}/>
              <Text variant="p" className="mt-2 text-center">
                {t("Error management")}
              </Text>
            </Column>
          </Row>
        </Card>
        <Row className="w-auto" gap={16}>
          <Label>{t("Get right where you left :")}</Label>
          <Button onPress={handleLoginPress}>
            {capitalizeFirst(t("user.login"))}
          </Button>
        </Row>
        <Text variant="p" className="text-muted-foreground">
          {t("Made with ❤️ by Ellande & Aloys || All rights reserved")}
        </Text>
        {/* <Image
        className="w-full h-100 absolute"
        source={require("~/assets/images/Cattail_flowers_Silouhette.svg")}
      /> */}
      </View>
      {/* Cattail Silhouette Image at the bottom */}
      <Image
        source={require("~/assets/images/Cattail_flowers_Silouhette.svg")}
        className="absolute bottom-0 left-0 w-full"
        style={{
          width: "100%",
          height: 120, // Adjust the height as needed
          tintColor: "rgba(0, 0, 0, 0.1)", // Muted color (semi-transparent black)
        }}
      />
    </>
  );
}
