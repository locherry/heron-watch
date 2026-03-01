import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, LayoutChangeEvent, View } from "react-native";
import { KnownErrorsTable } from "~/@types/ErrorManager";
import { StockCategory } from "~/@types/stock";
import { BaseTableProps } from "~/@types/table";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

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
  //Define call back to navigate to the correct page after clicking on a row
  const onPress = (product_code: string, batch_number: string) => {
    router.push({
      pathname: "/home/specific_product_error_management",
      params: {
        product_code: product_code,
        batch_number: batch_number,
        stock_category: stockCategory,
      },
    });
  };
  const handleLayout = (event: LayoutChangeEvent) => {
    setFixedWidth(event.nativeEvent.layout.width);
  };
  const { data, isLoading, isError } = useFetchQuery(
    "/errors_and_quantities/{stock_category}",
    "get",
    {
      path: { stock_category: stockCategory },
      query: {
        filter_params: { product_code: product_code },
      },
    },
    undefined,
    product_code ? true : false,
  );
  const columns: ColumnDef<KnownErrorsTable>[] = [
    {
      id: "batch_number",
      accessorKey: "batch_number",
      header: () => capitalizeFirst(t("actions.product_code")),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
    },
  ];
  return (
    <View onLayout={handleLayout}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <BaseTable
          data={(data?.data as BaseTableProps<KnownErrorsTable>["data"]) ?? []}
          columns={columns}
          fixedWidth={fixedWidth}
          onPress={onPress}
        />
      )}
    </View>
  );
}
