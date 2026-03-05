import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, LayoutChangeEvent, View } from "react-native";
import { ApiResponse } from "~/@types/api";
import { StockCategory } from "~/@types/stock";
import { BaseTableProps } from "~/@types/table";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

type KnownErrorRow = ApiResponse<"/api/known_errors", "get">["member"][number];

export function ErrorsTable({
  product_code,
  stockCategory,
}: {
  product_code: string | undefined;
  stockCategory: StockCategory;
}) {
  const [fixedWidth, setFixedWidth] = useState<undefined | number>(undefined);
  const [t] = useTranslation();
  const router = useRouter();

  const onPress = (product_code: string, batch_number: string) => {
    router.push({
      pathname: "/home/specific_product_error_management",
      params: {
        product_code,
        batch_number,
        stock_category: stockCategory,
      },
    });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setFixedWidth(event.nativeEvent.layout.width);
  };

  const { data, isLoading, isError } = useFetchQuery(
    "/api/known_errors",
    "get",
    {
      query: {
        stock_category: stockCategory,
      },
    },
    undefined,
    product_code ? true : false,
  );

  // Filter by product_code client-side since the API filters by stock_category only
  const filteredData = data?.member?.filter(
    (item) => item.action?.product?.product_code === product_code,
  );

  const columns: ColumnDef<KnownErrorRow>[] = [
    {
      id: "batch_number",
      accessorFn: (row) => row.action?.batch_number,
      header: () => capitalizeFirst(t("actions.batch_number")),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
    },
  ];
  const flattenedData = filteredData?.map((item) => ({
    ...item,
    product_code: item.action?.product?.product_code,
    batch_number: item.action?.batch_number,
  }));

  return (
    <View onLayout={handleLayout}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <BaseTable
          data={(flattenedData as BaseTableProps<KnownErrorRow>["data"]) ?? []}
          columns={columns}
          fixedWidth={fixedWidth}
          onPress={onPress}
        />
      )}
    </View>
  );
}
