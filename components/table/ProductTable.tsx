import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { ProductRead } from "~/@types/product";
import { BaseTableProps } from "~/@types/table";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

type ProductTableProps = Omit<BaseTableProps<ProductRead>, "columns">;

export function ProductTable({ ...props }: ProductTableProps) {
  const [t] = useTranslation();

  // --- Base columns ---
  const columns = React.useMemo<ColumnDef<ProductRead>[]>(
    () => [
      {
        id: "product_code",
        accessorKey: "product_code",
        header: () => capitalizeFirst(t("product.product_code")),
      },
      {
        id: "product_name",
        accessorKey: "product_name",
        header: () => capitalizeFirst(t("product.product_name")),
      },
      {
        id: "product_specificity",
        accessorKey: "product_specificity",
        header: () => capitalizeFirst(t("product.product_specificity")),
      },
    ],
    [],
  );

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
      features={{ sorting: props.sorting, edition: props.editEnabled }}
    />
  );
}
