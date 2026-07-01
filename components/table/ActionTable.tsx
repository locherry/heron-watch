import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ActionRead } from "~/@types/action";
import { BaseTableProps } from "~/@types/table";
import { constants } from "~/lib/constants";
import { useFormatDate } from "~/lib/hooks/useFormatDate";
import { capitalizeFirst } from "~/lib/utils";
import Row from "../layout/Row";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BaseTable } from "./BaseTable";

export function ActionTable(
  props: Omit<BaseTableProps<ActionRead>, "columns">,
) {
  const [t] = useTranslation();
  const formatDate = useFormatDate();
  const columns: ColumnDef<ActionRead>[] = [
    {
      id: "product",
      accessorKey: "product",
      header: () => capitalizeFirst(t("actions.product_code")),
      cell: ({ row, getValue }) => {
        const product = getValue<ActionRead["product"]>();
        const isCorrection = !!row.original.correction_of;

        return (
          <Row gap={6}>
            <Text>
              {product.product_code} — {product.product_name}
            </Text>
            {isCorrection && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <View className="rounded-full bg-amber-100 px-2 py-0.5">
                    <Text className="text-xs text-amber-800">
                      {capitalizeFirst(t("actions.correction_badge"))}
                    </Text>
                  </View>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>
                    {t("actions.correction_tooltip", {
                      user: row.original.corrected_by_user
                        ? `${row.original.corrected_by_user.first_name} ${row.original.corrected_by_user.last_name}`
                        : t("user.unknownUser"),
                      date: row.original.corrected_at
                        ? formatDate(new Date(row.original.corrected_at))
                        : "-",
                    })}
                  </Text>
                </TooltipContent>
              </Tooltip>
            )}
          </Row>
        );
      },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => capitalizeFirst(t("actions.quantity")),
      cell: ({ row }) => {
        const quantity = row.original.quantity ?? 0;
        const additionRule = row.original.action_category.addition_rule;

        const displayQuantity = additionRule === "+" ? quantity : -quantity;

        return <Text>{displayQuantity}</Text>;
      },
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

      cell: ({ getValue }) => {
        const raw = getValue<ActionRead["created_at"]>();
        if (!raw) return <Text>-</Text>;

        const date = new Date(raw);
        return <Text>{formatDate(date)}</Text>;
      },
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
            {!created_by_id && t("user.unknownUser")}
            {created_by_id && (
              <>
                {created_by_id.first_name} {created_by_id.last_name}
              </>
            )}
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
      getRowState={(item) => ({
        muted: item.corrected === true,
        disabled: item.corrected === true,
        tooltip: item.corrected ? t("actions.corrected_tooltip") : undefined,
      })}
    />
  );
}
