/**
 * Readme please
 *
 * Stock type refers to the type of stock, whether it is "raw_materials" or "finished_products"
 * Stock category refers to the category of stock, e.g. "PF_G" | "MP_F"
 */

import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { StockCategory, StockSortState } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { StockTable } from "~/components/table/StockTable";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function ViewStocks() {
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: StockCategory;
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
      <Header
        title={capitalizeFirst(t("stocks.viewStocks"))}
        className="justify-between"
      >
        <Tooltip>
          <TooltipTrigger>
            <Icon as={constants.stockCategoryIcon[stockCategory]} />
          </TooltipTrigger>
          <TooltipContent>
            <Text>
              {capitalizeFirst(t("stocks.finishedProducts"))}
              {" - "}
              {t(("stocks." + stockCategory) as "stocks.PF_G")}
            </Text>
          </TooltipContent>
        </Tooltip>
      </Header>
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
    </RootView>
  );
}
