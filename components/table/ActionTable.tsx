import { InfiniteQueryObserverResult } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import * as React from "react";
import {
  FlatList,
  ScrollView,
  View,
  ViewProps,
  useWindowDimensions,
} from "react-native";
import { Action } from "~/@types/action";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { capitalizeFirst, cn } from "~/lib/utils";

type GenericFetchNextPage = (options?: {
  cancelRefetch?: boolean;
  pageParam?: unknown;
}) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;


type ActionTableProps = ViewProps & {
  data: Action[];
  fetchNextPage?: GenericFetchNextPage;
  totalRow?: boolean;
  editionMode?: boolean;
  onEdit?: (action: Action) => void;
  onDelete?: (action: Action) => void;
};

export function ActionTable({
  data,
  fetchNextPage,
  className,
  totalRow,
  editionMode,
  onEdit,
  onDelete,
}: ActionTableProps) {
  const { width, height } = useWindowDimensions();

  const tableHeight = Math.min(height * 0.6, 400);

  const baseColumns = React.useMemo<ColumnDef<Action>[]>(
    () => [
      { accessorKey: "product_code", header: () => capitalizeFirst(t("actions.product_code")) },
      { accessorKey: "quantity", header: () => capitalizeFirst(t("actions.quantity")) },
      { accessorKey: "lot_number", header: () => capitalizeFirst(t("actions.lot_number")) },
      { accessorKey: "created_at", header: () => capitalizeFirst(t("actions.created_at")) },
      { accessorKey: "comment", header: () => capitalizeFirst(t("actions.comment")) },
      { accessorKey: "created_by_id", header: () => capitalizeFirst(t("actions.created_by_id")) },
      { accessorKey: "action_id", header: () => capitalizeFirst(t("actions.action_id")) },
      { accessorKey: "transaction", header: () => capitalizeFirst(t("actions.transaction")) },
    ],
    []
  );

  const columns = React.useMemo<ColumnDef<Action>[]>(() => {
    if (!editionMode) return baseColumns;
    return [
      ...baseColumns,
      {
        id: "actions",
        header: () => capitalizeFirst(t("common.actions")),
        cell: ({ row }) => (
          <View className="flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onPress={() => onEdit?.(row.original)}
            >
              <Text>Edit</Text>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onPress={() => onDelete?.(row.original)}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        ),
      },
    ];
  }, [editionMode, baseColumns, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const columnWidths = React.useMemo(() => {
    const minWidths = editionMode
      ? [120, 120, 180, 180, 180, 180, 180, 180, 180, 160]
      : [120, 120, 180, 180, 180, 180, 180, 180, 180];
    return minWidths.map((min) => Math.max(min, width / minWidths.length));
  }, [width, editionMode]);

  const renderHeader = () => (
    <View className="flex-row border-b border-border bg-background">
      {table.getHeaderGroups().map((hg) =>
        hg.headers.map((header, i) => (
          <View key={header.id} style={{ width: columnWidths[i] }} className="p-2">
            {!header.isPlaceholder && (
              <Text className="font-bold text-foreground">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderRow = ({
    item,
    index,
  }: {
    item: (typeof rows)[number];
    index: number;
  }) => (
    <View
      key={item.id}
      className={index % 2 ? "flex-row bg-muted" : "flex-row bg-background"}
    >
      {item.getVisibleCells().map((cell, i) => (
        <View key={cell.id} style={{ width: columnWidths[i] }} className="p-2">
          <Text className="text-foreground">
            {flexRender(cell.column.columnDef.cell, cell.getContext()) ??
              (cell.getValue() as string | number | null)}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className={cn("flex-1", className)}>
      {/* Horizontal scroll wraps BOTH header + body */}
      <ScrollView horizontal>
        <View>
          {renderHeader()}
          <FlatList
            data={rows}
            keyExtractor={(row) => row.id}
            renderItem={renderRow}
            onEndReached={() => fetchNextPage?.()}
            onEndReachedThreshold={0.5}
            style={{ maxHeight: tableHeight }}
          />
        </View>
      </ScrollView>

      {totalRow && (
        <View className="flex-row justify-between p-2 border-t border-border bg-background">
          <Text className="text-foreground">{t("Total actions")}</Text>
          <Button size="sm" variant="ghost" onPress={() => fetchNextPage?.()}>
            <Text className="text-foreground">{data?.length}</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
