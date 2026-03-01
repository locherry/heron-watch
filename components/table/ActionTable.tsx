import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ActionRead } from "~/@types/action";
import { BaseTableProps } from "~/@types/table";
import { constants } from "~/lib/constants";
import { capitalizeFirst } from "~/lib/utils";
import Row from "../layout/Row";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { BaseTable } from "./BaseTable";

export function ActionTable(
  props: Omit<BaseTableProps<ActionRead>, "columns">,
) {
  const [t] = useTranslation();

  const columns: ColumnDef<ActionRead>[] = [
    {
      id: "product",
      accessorKey: "product",
      header: () => capitalizeFirst(t("actions.product_code")),
      cell: ({ getValue }) => {
        const product = getValue<ActionRead["product"]>();
        return (
          <Text>
            {product.product_code} — {product.product_name}
          </Text>
        );
      },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
    },
    {
      id: "batch_number",
      accessorKey: "batch_number",
      header: () => capitalizeFirst(t("actions.batch_number")),
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
      cell: ({ getValue }) => {
        const created_by_id = getValue<ActionRead["created_by_id"]>();
        return (
          <Text>
            {/* TODO */}
            {/* <Link href={`/users/${created_by_id.id}`}> */}
            {created_by_id.first_name} {created_by_id.last_name}
            {/* </Link> */}
          </Text>
        );
      },
    },
    {
      id: "action_category",
      accessorKey: "action_category",
      header: () => capitalizeFirst(t("actions.action_id")),

      cell: ({ getValue }) => {
        const action_category = getValue<ActionRead["action_category"]>();
        const currentActionType = constants.actionTypes.find(
          (actionType) => actionType.label == action_category.action_name,
        );
        return (
          <Row gap={8}>
            {currentActionType?.icon && <Icon as={currentActionType.icon} />}
            <Text>{t(action_category.action_name as "I stock")}</Text>
          </Row>
        );
      },
      // cell: (item) => {
      //   const currentActionType = constants.actionTypes.find(
      //     (actionType) => actionType.value == item.getValue(),
      //   );
      //   return (
      //     <Row gap={8}>
      //       {currentActionType?.icon && <Icon as={currentActionType.icon} />}
      //       <Text>
      //         {currentActionType?.label &&
      //           capitalizeFirst(t(currentActionType.label))}
      //       </Text>
      //     </Row>
      //   );
      // },
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
