import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionSortState } from "~/@types/action";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import { TableFilter, TableFilterValue } from "~/components/table/TableFilter";
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
  const [sorting, setSorting] = useState<ActionSortState | null>({
    order_by: "created_at",
    sort: "desc",
  });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TableFilterValue>({});

  // Reset page when category, sorting, or filters change
  React.useEffect(() => {
    setPage(1);
  }, [stockCategory, sorting, filters]);

  const endOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };

  const { data, isLoading, isError, error } = useFetchQuery(
    "/api/actions",
    "get",
    {
      query: {
        stock_category: stockCategory,
        page,
        ...(sorting ? { [`order[${sorting.order_by}]`]: sorting.sort } : {}),
        ...(filters.startDate
          ? { "created_at[after]": filters.startDate.toISOString() }
          : {}),
        ...(filters.endDate
          ? { "created_at[before]": endOfDay(filters.endDate).toISOString() }
          : {}),
        ...(filters.actionCategoryId
          ? { action_category: filters.actionCategoryId }
          : {}),
        ...(filters.productCode
          ? { "product.product_code": filters.productCode }
          : {}),
        ...(filters.batchNumber ? { batch_number: filters.batchNumber } : {}),
      },
    },
  );

  const totalItems = data?.["totalItems"] ?? 0;
  const totalPages = Math.ceil(totalItems / 10);

  if (isError) {
    console.error(error.message);
  }

  const sortOptions = [
    { label: capitalizeFirst(t("actions.created_at")), value: "created_at" },
    { label: capitalizeFirst(t("actions.quantity")), value: "quantity" },
    { label: capitalizeFirst(t("actions.product_code")), value: "product" },
  ];

  const handleApplyFilters = (value: TableFilterValue) => {
    setFilters(value);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <RootView disableInsets={{ left: true }}>
      <Header
        title={capitalizeFirst(t("actions.viewActions"))}
        className="justify-between"
      >
        <Row gap={8}>
          <TableFilter
            sortOptions={sortOptions}
            defaultValue={filters}
            stockCategory={stockCategory}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

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
    </RootView>
  );
}
