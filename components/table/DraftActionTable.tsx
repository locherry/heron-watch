import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { BaseTableProps } from "~/@types/table";
import { constants } from "~/lib/constants";
import { useFormatDate } from "~/lib/hooks/useFormatDate";
import { DraftAction } from "~/lib/stores/useDraftActionsStore";
import { capitalizeFirst } from "~/lib/utils";
import Row from "../layout/Row";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { BaseTable } from "./BaseTable";

export function DraftActionTable(
  props: Omit<BaseTableProps<DraftAction>, "columns">,
) {
  const [t] = useTranslation();
  const formatDate = useFormatDate();

  const columns: ColumnDef<DraftAction>[] = [
    {
      id: "product_code",
      accessorKey: "product_code",
      header: () => capitalizeFirst(t("actions.product_code")),
    },
    {
      id: "batch_number",
      accessorKey: "batch_number",
      header: () => capitalizeFirst(t("actions.batch_number")),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
    },
    {
      id: "expire_at",
      accessorKey: "expire_at",
      header: () => capitalizeFirst(t("actions.expireAt")),
      cell: ({ getValue }) => {
        const raw = getValue<DraftAction["expire_at"]>();
        if (!raw) return <Text>-</Text>;

        const date = new Date(raw);
        return <Text>{formatDate(date)}</Text>;
      },
    },
    {
      id: "action_category",
      accessorKey: "action_category",
      header: () => capitalizeFirst(t("actions.action_id")),
      cell: ({ getValue }) => {
        const id = getValue<number>();
        const actionType = constants.actionTypes.find(
          (a) => Number(a.value) === id,
        );
        return (
          <Row gap={8}>
            {actionType?.icon && <Icon as={actionType.icon} />}
            <Text>{actionType ? t(actionType.label as "I stock") : id}</Text>
          </Row>
        );
      },
    },
    {
      id: "comment",
      accessorKey: "comment",
      header: () => capitalizeFirst(t("actions.comment")),
    },
    {
      id: "transaction_code",
      accessorKey: "transaction_code",
      header: () => capitalizeFirst(t("actions.transaction")),
    },
  ];

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
      features={{ sorting: props.sorting, edition: props.editEnabled }}
    />
  );
}
