import { useRouter } from "expo-router"; // For navigation
import { t } from "i18next";
import * as React from "react";
import { Image, View } from "react-native";
import Banner from "~/components/Banner";
import Column from "~/components/layout/Column";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { H4, P } from "~/components/ui/typography";
import { Megaphone } from "~/lib/icons/Megaphone"; // Assuming you have a RefreshCcw icon
import { RefreshCcw } from "~/lib/icons/RefreshCcw"; // Assuming you have a RefreshCcw icon
import { ServerCrash } from "~/lib/icons/ServerCrash"; // Assuming you have a RefreshCcw icon
import { capitalizeFirst } from "~/lib/utils";
export default function App() {
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
          <H4 className="text-xl font-semibold mb-3">
            {t("Your all in one solution for:")}
          </H4>
          <Row className="">
            <Column className="h-full items-center w-1/3">
              <RefreshCcw className="text-foreground" />
              <P className="mt-2 text-center">{t("Real-Time Tracking")}</P>
            </Column>
            <Column className="h-full items-center w-1/3">
              <Megaphone className="text-foreground" />
              <P className="mt-2 text-center">{t("Inventory Alerts")}</P>
            </Column>
            <Column className="h-full items-center w-1/3">
              <ServerCrash className="text-foreground" />
              <P className="mt-2 text-center">{t("Error management")}</P>
            </Column>
          </Row>
        </Card>
        <Row className="flex-none" gap={16}>
          <Label>{t("Get right where you left :")}</Label>
          <Button onPress={handleLoginPress}>
            {capitalizeFirst(t("user.login"))}
          </Button>
        </Row>
        <P className="text-muted-foreground">
          {t("Made with ❤️ by Ellande & Aloys || All rights reserved")}
        </P>
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
