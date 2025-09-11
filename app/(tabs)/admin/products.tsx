import { Link } from "expo-router";
import { t } from "i18next";
import { Cylinder, Forklift, Plus, Snowflake } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ProductCategoryTable } from "~/components/table/ProductCategoryTable";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

type stockGlobalCategory = "PF" | "MP" | "EMB";

export default function App() {
  const [stockGlobalCategory, setStockGlobalCategory] =
    useState<stockGlobalCategory>("PF");
  const GENERAL_STOCK_CATEGORIES = [
    { value: "PF", label: t("stocks.finishedProducts"), icon: Forklift },
    { value: "MP", label: t("stocks.rawMaterials"), icon: Snowflake },
    { value: "EMB", label: t("stocks.packaging"), icon: Cylinder },
  ] as const;

  const { data, isLoading, isError, fetchNextPage } = useInfiniteFetchQuery(
    "/productCategory/{stock_global_category}",
    "get",
    {
      path: { stock_global_category: stockGlobalCategory },
      query: { limit: 10 },
    }
  );

  if (isError) {
    return <Text>Error loading products</Text>;
  }

  return (
    <RootView>
      {/* Products */}
      <View className="gap-y-10">
        <Row className="justify-between">
          <Header title={capitalizeFirst(t("common.products"))} className=""/>
          <Select
            defaultValue={GENERAL_STOCK_CATEGORIES[0]}
            value={GENERAL_STOCK_CATEGORIES.find(
              (option) => option.value == stockGlobalCategory
            )}
            onValueChange={(option) =>
              setStockGlobalCategory(
                option?.value as (typeof GENERAL_STOCK_CATEGORIES)[number]["value"]
              )
            }
            className=""
          >
            <SelectTrigger>
              <SelectValue
                placeholder={capitalizeFirst(
                  t("product_category.selectStockGeneralCategory")
                )}
              >
                <View className="mr-2 flex flex-row items-center">
                  {(() => {
                    const selectedOption = GENERAL_STOCK_CATEGORIES.find(
                      (option) => option.value === stockGlobalCategory
                    );
                    if (selectedOption?.icon) {
                      return <Icon as={selectedOption.icon} className="mr-2" size={16} />;
                    }
                    return null;
                  })()}
                  <Text className="capitalize">
                    {
                      GENERAL_STOCK_CATEGORIES.find(
                        (option) => option.value == stockGlobalCategory
                      )?.label
                    }
                  </Text>
                </View>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {GENERAL_STOCK_CATEGORIES.map((stock) => (
                <SelectItem
                  key={stock.value}
                  value={String(stock.value)}
                  label={capitalizeFirst(stock.label)}
                  icon={stock.icon}
                />
              ))}
            </SelectContent>
          </Select>
        </Row>
        {isLoading ? (
          <ActivityIndicator />
        ) : (

          <ProductCategoryTable
            // className="flex-1 h-full border-red-500 border-4"
            data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </View>
      <View>
        <Link
          href={{
            pathname: "/admin/add_new_product",
            params: { stockCategory: stockGlobalCategory },
          }}
          asChild
        >
          <Button icon={Plus} className="flex-1">
            {capitalizeFirst(t("product_category.new_product"))}
          </Button>
        </Link>
      </View>
    </RootView>
  );
}
