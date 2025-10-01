import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Action } from "~/@types/action";
import { BaseTableProps } from "~/@types/table";
import { constants } from "~/lib/constants";
import { capitalizeFirst } from "~/lib/utils";
import Row from "../layout/Row";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { BaseTable } from "./BaseTable";

export function ActionTable(props: Omit<BaseTableProps<Action>, "columns">) {
  const [t] = useTranslation();

  const columns: ColumnDef<Action>[] = [
    {
      id: "product_code",
      accessorKey: "product_code",
      header: () => capitalizeFirst(t("actions.product_code")),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
    },
    {
      id: "lot_number",
      accessorKey: "lot_number",
      header: () => capitalizeFirst(t("actions.lot_number")),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: () => capitalizeFirst(t("actions.created_at")),
    },
    {
      id: "comment",
      accessorKey: "comment",
      header: () => capitalizeFirst(t("actions.comment")),
    },
    {
      id: "created_by_id",
      accessorKey: "created_by_id",
      header: () => capitalizeFirst(t("actions.created_by_id")),
    },
    {
      id: "action_id",
      accessorKey: "action_id",
      header: () => capitalizeFirst(t("actions.action_id")),
      cell: (item) => {
        const currentActionType = constants.actionTypes.find(
          (actionType) => actionType.value == item.getValue()
        );
        return (
          <Row gap={8}>
            {currentActionType?.icon && <Icon as={currentActionType.icon} />}
            <Text>
              {currentActionType?.label &&
                capitalizeFirst(t(currentActionType.label))}
            </Text>
          </Row>
        );
      },
    },
    {
      id: "transaction",
      accessorKey: "transaction",
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
