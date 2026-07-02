import { useLocalSearchParams } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { StockCategory, StockSortState } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import {
  BottomSheetModal,
  BottomSheetTrigger,
  BottomSheetView,
} from "~/components/ui/bottom-sheet";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function ViewActions() {
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory: StockCategory;
  };
  const [sorting, setSorting] = useState<StockSortState | null>(null);

  const [page, setPage] = useState(1);

  const filterSheetRef = useRef<BottomSheetModal>(null);
  const filterSnapPoints = useMemo(() => ["40%", "70%"], []);

  const handleOpenFilters = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  // Reset page when category, or sorting changes
  React.useEffect(() => {
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
      <Header
        title={capitalizeFirst(t("actions.viewActions"))}
        className="justify-between"
      >
        <Row gap={8}>
          <Button variant="ghost" onPress={handleOpenFilters}>
            <Icon as={SlidersHorizontal} />
          </Button>

          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost">
                <Icon as={constants.stockCategoryIcon[stockCategory]} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Text>
                {capitalizeFirst(t("stocks.finishedProducts"))}
                {" - "}
                {t(("stocks." + stockCategory) as "stocks.PF_G")}
              </Text>
            </TooltipContent>
          </Tooltip>
        </Row>
      </Header>

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

      <BottomSheetModal
        ref={filterSheetRef}
        index={0}
        snapPoints={filterSnapPoints}
      >
        {Platform.OS === "web" && (
          <BottomSheetTrigger>Hello</BottomSheetTrigger>
        )}
        <BottomSheetView className="flex-1 px-4 pt-2">
          <Text className="text-lg font-semibold mb-4">
            {capitalizeFirst(t("actions.filters"))}
          </Text>
          <Text className="text-muted-foreground">
            Filter options coming soon — UI demo only.
          </Text>
        </BottomSheetView>
      </BottomSheetModal>
    </RootView>
  );
}
