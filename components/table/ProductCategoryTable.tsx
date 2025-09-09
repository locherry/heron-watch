import { t } from "i18next";
import { ProductCategory } from "~/@types/productCategory";
import { BaseColumnDef, BaseTableProps } from "~/@types/table";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

export function ProductCategoryTable(
  props: Omit<BaseTableProps<ProductCategory>, "columns">
) {
  // --- Base columns ---
  const columns: BaseColumnDef<ProductCategory>[] = [
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
      header: () => capitalizeFirst(t("product_category.product_specificity")),
    },
  ];

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
    />
  );
}
