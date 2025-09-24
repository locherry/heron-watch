import React from "react";
import { useTranslation } from "react-i18next";
import { ProductCategory } from "~/@types/productCategory";
import { BaseColumnDef, BaseTableProps } from "~/@types/table";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

export function ProductCategoryTable(
  props: Omit<BaseTableProps<ProductCategory>, "columns">
) {
  const [t] = useTranslation();

  // --- Base columns ---
  const columns = React.useMemo<BaseColumnDef<ProductCategory>[]>(
    () => [
      {
        id: "product_code",
        accessorKey: "product_code",
        header: () => capitalizeFirst(t("product_category.product_code")),
      },
      {
        id: "product_name",
        accessorKey: "product_name",
        header: () => capitalizeFirst(t("product_category.product_name")),
      },
      {
        id: "product_specificity",
        accessorKey: "product_specificity",
        header: () =>
          capitalizeFirst(t("product_category.product_specificity")),
      },
    ],
    []
  );

  return <BaseTable {...props} data={props.data ?? []} columns={columns} />;
}
