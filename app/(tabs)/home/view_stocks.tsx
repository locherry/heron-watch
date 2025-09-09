/**
 * Readme please
 *
 * Stock type refers to the type of stock, whether it is "raw_materials" or "finished_products"
 * Stock category refers to the category of stock, e.g. "PF_G" | "MP_F"
 */

import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StockSortState } from "~/@types/stock";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { StockTable } from "~/components/table/StockTable";
import { Text } from "~/components/ui/text";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function ViewStocks() {

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: "PF_G" | "PF_M" | "MP_F" | "MP_S" | "MP_C";
  };
  const [sorting, setSorting] = useState<StockSortState | null>(null);

  const { data, error, isLoading, isError, fetchNextPage } =
    useInfiniteFetchQuery("/stocks/{stock_category}", "get", {
      path: { stock_category: stockCategory },
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
      {/* Action History */}
      <View className="flex-1">
        <Row className="flex-none">
          <Text variant="h3">{capitalizeFirst(t("stocks.viewStocks"))}</Text>
        </Row>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <StockTable
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
