import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { H3, P } from "~/components/ui/typography";
import { Leaf } from "~/lib/icons/Leaf";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";
import { Snowflake } from "~/lib/icons/Snowflake";
import { Sun } from "~/lib/icons/Sun";
import { capitalizeFirst } from "~/lib/utils";

export default function TabsScreen() {
  const stocksTabs = [
    { name: "fresh", icon: Leaf },
    { name: "dried", icon: Sun },
    { name: "frozen", icon: Snowflake },
    { name: "packaging", icon: Package },
  ];
  const [currentTabName, setCurrentTabName] = React.useState(
    stocksTabs[0].name
  );
  return (
    <RootView>
      <H3>{capitalizeFirst(t("stocks.rawMaterials"))}</H3>
      <Tabs
        value={currentTabName}
        onValueChange={setCurrentTabName}
        className="w-full max-w-[400px] flex-col gap-1.5 mb-2"
      >
        <TabsList className="flex-row w-full">
          {stocksTabs.map((tab) => (
            <TabsTrigger value={tab.name} className="flex-1" key={tab.name}>
              <Row>
                {React.createElement(tab.icon, {
                  className: `h-4 w-4 mr-2 ${
                    tab.name === currentTabName
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`,
                })}
                <Text>{capitalizeFirst(t("stocks."+ tab.name))}</Text>
              </Row>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <View className="flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <Button icon={Package} variant="outline">
          {t("View stocks")}
        </Button>
        <Button icon={Plus} variant="outline">
          {t("New actions")}
        </Button>
      </View>
      <H3>{capitalizeFirst(t("common.history"))}</H3>
      <P>Action table here ...</P>
    </RootView>
  );
}
