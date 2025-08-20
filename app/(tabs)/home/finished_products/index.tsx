import { Link } from "expo-router";
import { t } from "i18next";
import { Forklift } from "lucide-react-native";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Factory } from "~/assets/images/icons/Factory";
import { Package } from "~/assets/images/icons/Package";
import { Plus } from "~/assets/images/icons/Plus";
import { ServerCrash } from "~/assets/images/icons/ServerCrash";
import { Store } from "~/assets/images/icons/Store";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

export default function FinishedProductsTabsScreen() {
  const stocksTabs = [
    { name: "cannery", icon: Factory, category: "PF_G" },
    { name: "store", icon: Store, category: "PF_M" },
  ] as const;

  type StockName = (typeof stocksTabs)[number]["name"];

  const [currentTabName, setCurrentTabName] = React.useState<StockName>(
    stocksTabs[0].name
  );

  const stockCategory =
    stocksTabs.find((tab) => tab.name === currentTabName)?.category ?? "PF_G";

  const { data, error, isLoading, isError, fetchNextPage } =
    useInfiniteFetchQuery("/actions/{stock_category}", "get", {
      path: { stock_category: stockCategory },
      query: { limit: 10 },
    });

  if (isError) {
    console.log(error.message);
  }

  return (
    <RootView disableInsets={{"top":true, "left":true}}>
      {/* Tabs */}
      <Tabs
        value={currentTabName}
        onValueChange={(value) => setCurrentTabName(value as StockName)}
        className="w-full max-w-[500px] flex-col gap-1.5 mb-2"
      >
        <TabsList className="flex-row w-full">
          {stocksTabs.map((tab) => (
            <TabsTrigger value={tab.name} className="flex-1" key={tab.name}>
              <Row className="flex-1 justify-center">
                <tab.icon
                  className={cn(
                    "h-4 w-4 mr-2",
                    tab.name === currentTabName
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                />
                <Text>
                  {capitalizeFirst(
                    t(
                      ("stocks." + tab.name) as
                        | "stocks.cannery"
                        | "stocks.store"
                    )
                  )}
                </Text>
              </Row>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Buttons */}
      <View className="flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button icon={Package} variant="outline">
          {capitalizeFirst(t("stocks.viewStocks"))}
        </Button>
        <Link
          href={{
            pathname: "/home/finished_products/new_actions",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button icon={Plus} variant="outline">
            {t("actions.newActions")}
          </Button>
        </Link>
        <Button icon={ServerCrash} variant="outline">
          {t("Manage Errors")}
        </Button>
        <Button icon={Forklift} variant="outline">
          {t("Generate a new pallet sheet")}
        </Button>
      </View>

      {/* Action History */}
      <View className="flex-1">
        <Row className="flex-none">
          <H3>{capitalizeFirst(t("common.history"))}</H3>
        </Row>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          // <ActionTable
          //   data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
          //   fetchNextPage={fetchNextPage}
          // />

          <ActionTable
            // className="flex-1 h-full border-red-500 border-4"
            data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </View>
    </RootView>
  );
}
