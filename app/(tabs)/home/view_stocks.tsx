import { useLocalSearchParams } from "expo-router"; // Hook to read URL parameters
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // For internationalization and translations
import { ActivityIndicator } from "react-native"; // Loading spinner
import { StockCategory, StockSortState } from "~/@types/stock"; // Type definitions for stock category and sorting
import { Calendar } from "~/components/Calendar"; // Custom calendar component for selecting date
import Header from "~/components/Header"; // Header component
import RootView from "~/components/layout/RootView"; // Root view layout component
import Row from "~/components/layout/Row";
import { StockTable } from "~/components/table/StockTable"; // Table component to display stock data
import { Icon } from "~/components/ui/icon"; // Icon component for UI
import { Text } from "~/components/ui/text"; // Text component for displaying text
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"; // Tooltip UI components
import { constants } from "~/lib/constants"; // Constants like stock category icons
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils"; // Utility function to capitalize the first letter

export default function ViewStocks() {
  const [t] = useTranslation(); // Use translation hook to get translated text

  const rawParams = useLocalSearchParams(); // Fetch parameters from the URL
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory: StockCategory; // Get stock category from the params, default is "PF_G"
  };
  const [sorting, setSorting] = useState<StockSortState | null>(null); // State for sorting order and criteria
  const [date, setDate] = useState<Date>(new Date()); // State for the selected date
  const isDateToday =
    date === undefined || date.toDateString() === new Date().toDateString(); // Check if the selected date is today

  console.log(
    "Selected date:",
    date,
    isDateToday,
    date.toISOString().split("T")[0],
  );

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

  // If an error occurs during data fetching, log it
  if (isError) {
    console.error(error.message);
  }

  return (
    <RootView disableInsets={{ left: true }}>
      {/* Header section with tooltip and icon */}
      <Header
        title={capitalizeFirst(t("stocks.viewStocks"))} // Title with translation
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
        {/* Calendar component for selecting date, updates state on change */}
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

      {/* Loading spinner while data is being fetched */}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        // Display stock data table when data is available
        <StockTable
          className="z-0"
          data={data?.["member"] ?? []}
          sorting={sorting}
          onSortingChange={setSorting}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </RootView>
  );
}
