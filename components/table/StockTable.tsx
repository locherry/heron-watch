import { t } from "i18next";
import { Stock } from "~/@types/stock";
import { BaseColumnDef, BaseTableProps } from "~/@types/table";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

// Define default columns for the stock table
const STOCK_TABLE_COLUMNS: (keyof Stock)[] = [
  "id",
  "product_code",
  "lot_number",
  "quantity",
  "expiration_date",
];

export function StockTable(props: Omit<BaseTableProps<Stock>, "columns">) {
  // Generate BaseColumnDef dynamically from the STOCK_TABLE_COLUMNS array
  const columns: BaseColumnDef<Stock>[] = STOCK_TABLE_COLUMNS.map((key) => ({
    id: key,
    accessorKey: key,
    header: () => capitalizeFirst(t(`stocks.${key}`)),
  }));

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
      features={{ sorting: true, edition: false }} // enable/disable features as needed
    />
  );
}
