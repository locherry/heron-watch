import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StockCategory, StockSortState } from "~/@types/stock";
import { Calendar } from "~/components/Calendar";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { StockTable } from "~/components/table/StockTable";
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

export default function ViewStocks() {
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory: StockCategory;
  };
  const [sorting, setSorting] = useState<StockSortState | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const isDateToday =
    date === undefined || date.toDateString() === new Date().toDateString();

  const [page, setPage] = useState(1);

  // Reset page when category, date, or sorting changes
  useEffect(() => {
    setPage(1);
  }, [stockCategory, date, sorting]);

  const { data, isLoading, isError, error } = useFetchQuery(
    "/api/stock/current_stock",
    "get",
    {
      query: {
        stock_category: stockCategory,
        page,
        ...(isDateToday
          ? {}
          : { date: date.toISOString().split("T")[0] + " 00:00:00" }),
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

      <Row className="items-center" gap={8}>
        <Calendar
          date={date}
          onDateChange={(date) => setDate(date as Date)}
          className="z-50"
        />
        <Text>
          {isDateToday
            ? capitalizeFirst(t("Current stock"))
            : capitalizeFirst(
                t("Stock as of") + " : " + date?.toLocaleDateString(),
              )}
        </Text>
      </Row>

      <StockTable
        className="z-0"
        data={data?.["member"] ?? []}
        sorting={sorting}
        onSortingChange={setSorting}
        page={page}
        totalPages={totalPages || 1}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </RootView>
  );
}
