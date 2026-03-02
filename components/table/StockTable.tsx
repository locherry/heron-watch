import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { StockRead } from "~/@types/stock";
import { BaseTableProps } from "~/@types/table";
import { useFormatDate } from "~/lib/hooks/useformatDate";
import { capitalizeFirst } from "~/lib/utils";
import { Text } from "../ui/text";
import { BaseTable } from "./BaseTable";

type StockTableProps = Omit<BaseTableProps<StockRead>, "columns"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function StockTable({
  page,
  totalPages,
  onPageChange,
  ...props
}: StockTableProps) {
  const [t] = useTranslation();
  const formatDate = useFormatDate();

  const columns: ColumnDef<StockRead>[] = [
    {
      id: "product",
      accessorKey: "product",
      header: () => capitalizeFirst(t("stocks.product_code")),
      cell: ({ getValue }) => {
        const product = getValue<StockRead["product"]>();
        return (
          <Text>
            {product.product_code} — {product.product_name}
          </Text>
        );
      },
    },
    {
      id: "batch_number",
      accessorKey: "batch_number",
      header: () => capitalizeFirst(t("stocks.batch_number")),
      cell: ({ getValue }) => (
        <Text>{getValue<StockRead["batch_number"]>()}</Text>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("stocks.quantity")),
      cell: ({ getValue }) => <Text>{getValue<StockRead["quantity"]>()}</Text>,
    },
    {
      id: "expire_at",
      accessorKey: "expire_at",
      header: () => capitalizeFirst(t("stocks.expiration_date")),
      cell: ({ getValue }) => {
        const raw = getValue<StockRead["expire_at"]>();
        if (!raw) return <Text>-</Text>;

        const date = new Date(raw);
        return <Text>{formatDate(date)}</Text>;
      },
    },
  ];

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
      features={{ sorting: props.sorting, edition: props.editEnabled }}
      onPageChange={onPageChange}
      page={page}
      totalPages={totalPages}
      // page, totalPages, onPageChange flow through via {...props}
    />
  );
}
