/**
 * Readme please
 *
 * Stock group refers to the type of stock, whether it is "MP" (raw_materials) or "PF" (finished_products)
 * Stock category refers to the category of stock, e.g. "PF_G" | "MP_F"
 */

import { Link } from "expo-router";
import {
  ChevronRight,
  Forklift,
  Package,
  Plus,
  ServerCrash,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import { ActionSortState } from "~/@types/action";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import ToggleStock from "~/components/ToggleStock";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function MaterialTabsExample() {
  const [t] = useTranslation();

  const [stockGroup, setStockGroup] = useState<
    (typeof constants.stockGroups)[number]
  >(constants.stockGroups[0]);
  const [stockCategory, setStockCategory] = useState<
    (typeof constants.stockCategories)[number]
  >(constants.stockCategories[0]);

  const [sorting, setSorting] = useState<ActionSortState | null>(null);
  const [page, setPage] = useState(1);

  // Reset page when category, or sorting changes
  useEffect(() => {
    setPage(1);
  }, [stockCategory, sorting]);

  const { data, isLoading, isError, error } = useFetchQuery(
    "/api/actions",
    "get",
    {
      query: {
        stock_category: stockCategory,
        page,
        ...(sorting ? { [`order[${sorting.order_by}]`]: sorting.sort } : {}),
      },
    },
  );

  const totalItems = data?.["totalItems"] ?? 0;
  const totalPages = Math.ceil(totalItems / 10);

  if (isError) {
    console.error(error.message);
  }

  return (
    <RootView disableInsets={{ left: true }}>
      {/* Tabs */}
      <ToggleStock
        stockGroup={stockGroup}
        stockCategory={stockCategory}
        onStockCategoryChange={setStockCategory}
        onStockGroupChange={setStockGroup}
      />
      {/* Buttons */}
      <View className="flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Link
          href={{
            pathname: "/home/view_stocks",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button icon={Package} variant="outline">
            {capitalizeFirst(t("stocks.viewStocks"))}
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/home/manage_error_menu",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button icon={ServerCrash} variant="outline">
            {capitalizeFirst(t("manageErrors"))}
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/home/pallet_sheets",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button icon={Forklift} variant="outline">
            {capitalizeFirst(t("managePalletSheets"))}
          </Button>
        </Link>
      </View>

      {/* Action History */}
      <View className="flex-1">
        <Row className="flex-none justify-between">
          <Text variant="h3">{capitalizeFirst(t("actions.actionTable"))}</Text>
          <Row gap={8}>
            <Link
              href={{
                pathname: "/home/actions/new_action",
                params: { stockCategory: stockCategory },
              }}
              asChild
            >
              <Button icon={Plus} variant="outline">
                {Platform.OS == "web" &&
                  capitalizeFirst(t("actions.newActions"))}
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/home/actions",
                params: { stockCategory: stockCategory },
              }}
              asChild
            >
              <Button icon={ChevronRight} variant="outline">
                {Platform.OS == "web" &&
                  capitalizeFirst(t("common.viewDetails"))}
              </Button>
            </Link>
          </Row>
        </Row>

        <ActionTable
          className="z-0"
          data={data?.["member"] ?? []}
          sorting={sorting}
          onSortingChange={setSorting}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </View>
    </RootView>
  );
}
