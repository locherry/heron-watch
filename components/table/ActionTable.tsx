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
  Pressable,
  ScrollView,
  View,
  ViewProps,
  useWindowDimensions
} from "react-native";
import { Action, ActionSortState } from "~/@types/action";
import { ChevronDown } from "~/assets/images/icons/ChevronDown";
import { ChevronUp } from "~/assets/images/icons/ChevronUp";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { capitalizeFirst, cn } from "~/lib/utils";

// --- Types ---
type GenericFetchNextPage = (options?: {
  cancelRefetch?: boolean;
  pageParam?: unknown;
}) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;

type ActionTableHiddenKeys = keyof Action | "actions";

type ActionTableProps = ViewProps & {
  data: Action[];
  fetchNextPage?: GenericFetchNextPage;
  editionMode?: boolean;
  onEdit?: (action: Action) => void;
  onDelete?: (action: Action) => void;
  hiddenColumns?: ActionTableHiddenKeys[];
  totalRow?: boolean;
  sorting?: ActionSortState | null;
  onSortingChange?: (newSorting: ActionSortState | null) => void;
};

export function ActionTable({
  data,
  fetchNextPage,
  className,
  totalRow,
  editionMode,
  onEdit,
  onDelete,
  hiddenColumns,
  sorting,
  onSortingChange,
}: ActionTableProps) {
  const { width, height } = useWindowDimensions();
  const tableHeight = Math.min(height * 0.6, 400);

  // --- Base columns ---
  const baseColumns = React.useMemo<ColumnDef<Action>[]>(
    () => [
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
      },
      {
        id: "transaction",
        accessorKey: "transaction",
        header: () => capitalizeFirst(t("actions.transaction")),
      },
    ],
    []
  );

  // --- Sort logic
  const sortableColumns = [
    "created_at",
    "created_by_id",
    "action_id",
    "lot_number",
    "product_code",
    "id"    
  ];

  const toggleSort = (columnId: string) => {
    if (!onSortingChange || !sortableColumns.includes(columnId)) return;

    const isCurrentlySorted = sorting?.order_by === columnId;
    const currentDirection = sorting?.sort;

    let newSort: ActionSortState | null;

    if (!isCurrentlySorted) {
      newSort = {
        order_by: columnId as ActionSortState["order_by"],
        sort: "asc",
      };
    } else if (currentDirection === "asc") {
      newSort = {
        order_by: columnId as ActionSortState["order_by"],
        sort: "desc",
      };
    } else {
      newSort = null; // Reset sorting
    }

    onSortingChange(newSort);
  };

  // --- Columns (filtered + optional edition actions) ---
  const columns = React.useMemo<ColumnDef<Action>[]>(() => {
    const filteredBase = baseColumns.filter(
      (col) => !hiddenColumns?.includes(col.id as ActionTableHiddenKeys)
    );
    if (!editionMode) return filteredBase;

    return [
      ...filteredBase,
      ...(!hiddenColumns?.includes("actions")
        ? [
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
            } as ColumnDef<Action>,
          ]
        : []),
    ];
  }, [editionMode, baseColumns, hiddenColumns, onEdit, onDelete]);

  // --- React Table ---
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  // --- Dynamic column widths ---
  const columnWidths = React.useMemo(() => {
    const count = columns.length;
    return new Array(count).fill(0).map(() => Math.max(140, width / count));
  }, [width, columns]);

  // --- Render header ---
  const renderHeader = () => (
    <View className="flex-row border-b border-border bg-background">
      {table.getHeaderGroups().map((hg) =>
        hg.headers.map((header, i) => (
          <View
            key={header.id}
            style={{ width: columnWidths[i] }}
            className="py-2 px-2"
          >
            {!header.isPlaceholder && (
              <Pressable onPress={() => toggleSort(header.column.id)}>
                <View className="flex-row items-center">
                  <Text className="font-bold text-foreground mr-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Text>

                  {sortableColumns.includes(header.column.id) &&
                    sorting?.order_by === header.column.id &&
                    (sorting.sort === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </View>
              </Pressable>
            )}
          </View>
        ))
      )}
    </View>
  );

  // --- Render row ---
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
      {/* Horizontal scroll wraps BOTH header + body together */}
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
