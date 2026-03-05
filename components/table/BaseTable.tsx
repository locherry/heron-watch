import { flexRender } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pencil,
  X,
} from "lucide-react-native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { BaseTableProps } from "~/@types/table";
import { useColumnWidths } from "~/lib/hooks/useColumnWiths";
import { useTableLogic } from "~/lib/hooks/useTableLogic";
import { capitalizeFirst, cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

const SKELETON_ROW_COUNT = 10;

export function BaseTable<T>({
  data,
  columns,
  className,
  totalRow,
  fetchNextPage,
  onDelete,
  onEdit,
  features = { sorting: false, edition: false },
  fixedWidth,
  onPress = () => {},
  page,
  totalPages,
  onPageChange,
  isLoading,
  ...props
}: BaseTableProps<T> & { isLoading?: boolean }) {
  const [t] = useTranslation();

  const { tableInstance, toggleSort } = useTableLogic({
    data,
    columns,
    ...props,
  });

  let columnWidths = useColumnWidths({ columns });
  if (fixedWidth) {
    const count = columns.length;
    columnWidths = Array(count)
      .fill(0)
      .map(() => Math.max(140, fixedWidth / count));
  }

  const knownTotalPages = useRef(totalPages ?? 1);
  if ((totalPages ?? 1) > knownTotalPages.current) {
    knownTotalPages.current = totalPages ?? 1;
  }
  const stableTotalPages = knownTotalPages.current;

  const isPaginated =
    page !== undefined &&
    totalPages !== undefined &&
    onPageChange !== undefined;

  const renderHeader = () => (
    <View className="flex-row border-b border-border bg-background">
      {tableInstance.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers.map((header, index) => (
          <View
            key={header.id}
            style={{ width: columnWidths[index] }}
            className="p-2"
          >
            {!header.isPlaceholder && (
              <Pressable onPress={header.column.getToggleSortingHandler()}>
                <View className="flex-row items-center">
                  <Text className="font-bold text-foreground mr-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Text>
                  {{
                    asc: <Icon as={ChevronUp} className="text-foreground" />,
                    desc: <Icon as={ChevronDown} className="text-foreground" />,
                  }[header.column.getIsSorted() as "asc" | "desc"] ?? null}
                </View>
              </Pressable>
            )}
          </View>
        )),
      )}
    </View>
  );

  const renderSkeletonRows = () =>
    Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
      <View
        key={rowIndex}
        className={cn(
          "flex-row",
          rowIndex % 2 === 0 && !isLoading ? "bg-muted" : "bg-background",
        )}
      >
        {columnWidths.map((width, colIndex) => (
          <View key={colIndex} style={{ width }} className="p-2 justify-center">
            <Skeleton
              className="h-4 rounded"
              style={{ width: `${75 + ((rowIndex + colIndex) % 3) * 10}%` }}
            />
          </View>
        ))}
      </View>
    ));

  const renderRow = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      onPress={() => {
        onPress(item.original.product_code, item.original.batch_number);
      }}
    >
      <View
        className={cn(
          "flex-row",
          index % 2 === 0 ? "bg-muted" : "bg-background",
        )}
      >
        {item.getVisibleCells().map((cell: any, cellIndex: number) => (
          <View
            key={cell.id}
            style={{ width: columnWidths[cellIndex] }}
            className="p-2"
          >
            <Text>
              {flexRender(cell.column.columnDef.cell, cell.getContext()) ??
                (cell.getValue() as string | number | null)}
            </Text>
          </View>
        ))}
        {features.edition && (
          <View className="flex-row items-center space-x-2 p-2">
            <Button onPress={() => onEdit?.(item)} variant={"outline"}>
              <Icon as={Pencil} />
              <Text className="hidden lg:inline">
                {capitalizeFirst(t("common.edit"))}
              </Text>
            </Button>
            <Button onPress={() => onDelete?.(item)} variant={"outline"}>
              <Icon className="text-[hsl(var(--destructive))]" as={X} />
              <Text className="hidden lg:inline !text-[hsl(var(--destructive))]">
                {capitalizeFirst(t("common.delete"))}
              </Text>
            </Button>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className={cn("flex-1", className)}>
      <ScrollView horizontal>
        <View>
          {renderHeader()}

          {isLoading ? (
            renderSkeletonRows()
          ) : (
            <FlatList
              data={tableInstance.getRowModel().rows}
              keyExtractor={(row) => row.id}
              renderItem={renderRow}
              onEndReached={!isPaginated ? fetchNextPage : undefined}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </ScrollView>

      {totalRow && (
        <View className="flex-row justify-between p-2 border-t border-border bg-background">
          <Text>{capitalizeFirst(t("common.total"))}</Text>
          <Text>{data.length}</Text>
        </View>
      )}

      {isPaginated && (
        <View className="flex-row items-center justify-center gap-4 py-3 border-t border-border bg-background">
          <Button
            variant="outline"
            onPress={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            <Icon as={ChevronLeft} />
          </Button>

          <Text className="text-foreground">
            {page} / {stableTotalPages}
          </Text>

          <Button
            variant="outline"
            onPress={() => onPageChange(page + 1)}
            disabled={page >= stableTotalPages || isLoading}
          >
            <Icon as={ChevronRight} />
          </Button>
        </View>
      )}
    </View>
  );
}
