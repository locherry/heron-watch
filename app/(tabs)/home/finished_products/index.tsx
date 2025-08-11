import { Link } from "expo-router";
import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import { ActionHistoryTable } from "~/components/actions/ActionHistoryTable";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { Factory } from "~/lib/icons/Factory";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";
import { ServerCrash } from "~/lib/icons/ServerCrash";
import { Store } from "~/lib/icons/Store";
import { useInfiniteFetchQuery } from "~/lib/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

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

  const { data, error, isLoading, isError, fetchNextPage } = useInfiniteFetchQuery(
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
      <H3>{capitalizeFirst(t("stocks.finishedProducts"))}</H3>

      {/* Tabs */}
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
      <View className="flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <Button icon={Package} variant="outline">
          {capitalizeFirst(t("stocks.viewStocks"))}
        </Button>
        <Link
          href={{ pathname: "/home/finished_products/new_actions", params: {stockCategory : stockCategory} }}
          asChild
        >
          <Button icon={Plus} variant="outline">
            {t("actions.newActions")}
          </Button>
        </Link>
        <Button icon={ServerCrash} variant="outline">
          {t("Manage Errors")}
        </Button>
      </View>

      {/* Action History */}
      <View>
        <Row className="flex-none">
          <H3>{capitalizeFirst(t("common.history"))}</H3>
        </Row>
        <ActionHistoryTable data={data?.pages.flatMap(page => page.data ?? []) ?? []} fetchNextPage={fetchNextPage} />
      </View>
    </RootView>
  );
}
