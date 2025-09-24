/**
 * Readme please
 *
 * Stock type refers to the type of stock, whether it is "raw_materials" or "finished_products"
 * Stock category refers to the category of stock, e.g. "PF_G" | "MP_F"
 */

import { Link } from "expo-router";
import {
  Factory,
  Forklift,
  Leaf,
  Package,
  Plus,
  ServerCrash,
  Snowflake,
  Store,
  Sun,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { ActionSortState } from "~/@types/action";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import {
  MaterialTabs,
  MaterialTabsList,
  MaterialTabsTrigger,
} from "~/components/ui/material-tabs";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

export default function MaterialTabsExample() {
  const [t] = useTranslation();

  // First Tab system
  const [currentStockType, setcurrentStockType] = useState<
    "raw_materials" | "finished_products"
  >("raw_materials");

  // Second Tab system
  const stockCategoryTabs = {
    raw_materials: [
      { name: "fresh", icon: Leaf, stock_category: "MP_F" },
      { name: "dry", icon: Sun, stock_category: "MP_S" },
      { name: "frozen", icon: Snowflake, stock_category: "MP_C" },
      { name: "packaging", icon: Package, stock_category: "EMB" },
    ],
    finished_products: [
      { name: "cannery", icon: Factory, stock_category: "PF_G" },
      { name: "store", icon: Store, stock_category: "PF_M" },
    ],
  } as const;

  type StockName = (typeof stockCategoryTabs)[
    | "raw_materials"
    | "finished_products"][number]["name"];
  type StockIcon = (typeof stockCategoryTabs)[
    | "raw_materials"
    | "finished_products"][number]["icon"];
  type StockCategory = (typeof stockCategoryTabs)[
    | "raw_materials"
    | "finished_products"][number]["stock_category"];

  const [currentStockCategory, setCurrentStockCategory] = React.useState<{
    raw_materials: StockCategory;
    finished_products: StockCategory;
  }>({
    raw_materials: stockCategoryTabs.raw_materials[0].stock_category, // default MP_F
    finished_products: stockCategoryTabs.finished_products[0].stock_category, // default PF_G
  });

  function updateStockCategory(
    type: "raw_materials" | "finished_products",
    value: StockCategory
  ) {
    setCurrentStockCategory((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  const [sorting, setSorting] = useState<ActionSortState | null>(null);

  const { data, error, isLoading, isError, fetchNextPage } =
    useInfiniteFetchQuery("/actions/{stock_category}", "get", {
      path: { stock_category: currentStockCategory[currentStockType] },
      query: {
        limit: 10,
        ...(sorting ? { sort: sorting.sort, order_by: sorting.order_by } : {}),
      },
    });

  if (isError) {
    console.error(error.message);
  }

  return (
    <RootView disableInsets={{ left: true }}>
      <MaterialTabs
        className="mb-2"
        value={currentStockType}
        onValueChange={(newValue) =>
          setcurrentStockType(newValue as "raw_materials" | "finished_products")
        }
      >
        <MaterialTabsList>
          <MaterialTabsTrigger value="raw_materials">
            {capitalizeFirst(t("stocks.rawMaterials"))}
          </MaterialTabsTrigger>
          <MaterialTabsTrigger value="finished_products">
            {capitalizeFirst(t("stocks.finishedProducts"))}
          </MaterialTabsTrigger>
        </MaterialTabsList>
      </MaterialTabs>
      {/* Tabs */}
      <Tabs
        value={currentStockCategory[currentStockType]}
        onValueChange={(value) =>
          updateStockCategory(currentStockType, value as StockCategory)
        }
        className="w-full max-w-[500px] flex-col gap-1.5 mb-2"
      >
        <TabsList className="flex-row w-full">
          {stockCategoryTabs[currentStockType].map((tab) => (
            <TabsTrigger
              value={tab.stock_category}
              className="flex-1 cursor-pointer"
              key={tab.stock_category}
            >
              <Row className="flex-1 justify-center">
                <Icon
                  as={tab.icon}
                  className={cn(
                    "h-4 w-4 mr-2",
                    tab.stock_category ===
                      currentStockCategory[currentStockType]
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                />
                <Text
                  className={cn(
                    tab.stock_category ===
                      currentStockCategory[currentStockType]
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
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
        <Link
          href={{
            pathname: "/home/view_stocks",
            params: { stockCategory: currentStockCategory[currentStockType] },
          }}
          asChild
        >
          <Button icon={Package} variant="outline">
            {capitalizeFirst(t("stocks.viewStocks"))}
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/home/new_actions",
            params: { stockCategory: currentStockCategory[currentStockType] },
          }}
          asChild
        >
          <Button icon={Plus} variant="outline">
            {capitalizeFirst(t("actions.newActions"))}
          </Button>
        </Link>
        <Button icon={ServerCrash} variant="outline">
          {t("Manage Errors")}
        </Button>
        <Link
          href={{
            pathname: "/home/manage_pallet_sheet",
            params: { stockCategory: currentStockCategory[currentStockType] },
          }}
          asChild
        >
          <Button icon={Forklift} variant="outline">
            {t("Generate a new pallet sheet")}
          </Button>
        </Link>
      </View>

      {/* Action History */}
      <View className="flex-1">
        <Row className="flex-none">
          <Text variant="h3">{capitalizeFirst(t("common.history"))}</Text>
        </Row>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <ActionTable
            data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
            fetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        )}
      </View>
    </RootView>
  );
}
