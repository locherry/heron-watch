import { t } from "i18next";
import * as React from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionHistoryTable } from "~/components/actions/ActionHistoryTable";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { Leaf } from "~/lib/icons/Leaf";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";
import { ServerCrash } from "~/lib/icons/ServerCrash";
import { Snowflake } from "~/lib/icons/Snowflake";
import { Sun } from "~/lib/icons/Sun";
import { useInfiniteFetchQuery } from "~/lib/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function RawMaterialsTabsScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const columnWidths = React.useMemo(() => {
    const minColumnWidths = [60, 60, 180, 180, 180, 180, 180, 180, 180];
    return minColumnWidths.map((minWidth) => {
      const evenWidth = width / minColumnWidths.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  type StockName = ["fresh" | "dry" | "frozen" | "packaging"][number];

  const stocksTabs = [
    { name: "fresh", icon: Leaf, data: "MP_F" },
    { name: "dry", icon: Sun, data: "MP_S" },
    { name: "frozen", icon: Snowflake, data: "MP_C" },
    { name: "packaging", icon: Package, data: "EMB" },
  ] as const;

  const [currentTabName, setCurrentTabName] = React.useState<StockName>(stocksTabs[0].name);

  const stockCategory =
    stocksTabs.find((tab) => tab.name === currentTabName)?.data ?? "MP_F";

  const { data, error, isLoading, fetchNextPage,  isError } = useInfiniteFetchQuery(
    "/actions/{stock_category}",
    "get",
    { path: { stock_category: stockCategory }, query : {limit : 10} }
  );

  if (isError) {
    console.log(error.message);
  }

  if (isLoading) {
    return null; // or loader
  }

  return (
    <RootView>
      <H3>{capitalizeFirst(t("stocks.rawMaterials"))}</H3>

      <Tabs
        value={currentTabName}
        onValueChange={(value) => setCurrentTabName(value as StockName)}
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
                <Text>
                  {capitalizeFirst(t("stocks." + tab.name as "stocks.fresh"))}
                </Text>
              </Row>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <View className="flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <Button icon={Package} variant="outline">
          {capitalizeFirst(t("stocks.viewStocks"))}
        </Button>
        <Button icon={Plus} variant="outline">
          {t("New actions")}
        </Button>
        <Button icon={ServerCrash} variant="outline">
          {t("Manage Errors")}
        </Button>
      </View>

      <View>
        <Row className="flex-none">
          <H3>{capitalizeFirst(t("common.history"))}</H3>
        </Row>
        <ActionHistoryTable
          data={data?.pages.flatMap(page => page?.data ?? []) ?? []}
          columnWidths={columnWidths}
          fetchNextPage = {fetchNextPage}
        />
      </View>
    </RootView>
  );
}
