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
import { ProductCategory } from "~/@types/productCategory";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { capitalizeFirst, cn } from "~/lib/utils";

// --- Types ---
type GenericFetchNextPage = (options?: {
  cancelRefetch?: boolean;
  pageParam?: unknown;
}) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;

type ProductCateogoryHiddenKeys = keyof ProductCategory | "product-category";

type ProductCategoryTableProps = ViewProps & {
  data: ProductCategory[];
  fetchNextPage?: GenericFetchNextPage;
  totalRow?: boolean;
  editionMode?: boolean;
  onEdit?: (action: ProductCategory) => void;
  onDelete?: (action: ProductCategory) => void;
  hiddenColumns?: ProductCateogoryHiddenKeys[]; // 👈 fully typed
};

export function ProductCategoryTable({
  data,
  fetchNextPage,
  className,
  totalRow,
  editionMode,
  onEdit,
  onDelete,
  hiddenColumns,
}: ProductCategoryTableProps) {
  const { width, height } = useWindowDimensions();
  const tableHeight = Math.min(height * 0.6, 400);

  // --- Base columns ---
  const baseColumns = React.useMemo<ColumnDef<ProductCategory>[]>(
    () => [
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
    ],
    []
  );

  // --- Columns (filtered + optional edition actions) ---
  const columns = React.useMemo<ColumnDef<ProductCategory>[]>(() => {
    const filteredBase = baseColumns.filter(
      (col) => !hiddenColumns?.includes(col.id as ProductCateogoryHiddenKeys)
    );
    if (!editionMode) return filteredBase;

    return [
      ...filteredBase,
      ...(!hiddenColumns?.includes("product-category")
        ? [
            {
              id: "product-category",
              header: () => capitalizeFirst(t("common.product_category")),
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
            } as ColumnDef<ProductCategory>,
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
            className="p-2"
          >
            {!header.isPlaceholder && (
              <Text className="font-bold text-foreground">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Text>
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
          <Text className="text-foreground">{t("Total products")}</Text>
          <Button size="sm" variant="ghost" onPress={() => fetchNextPage?.()}>
            <Text className="text-foreground">{data?.length}</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
