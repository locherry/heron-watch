import { flexRender } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pencil,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { BaseTableProps } from "~/@types/table";
import { useColumnWidths } from "~/lib/hooks/useColumnWiths";
import { useTableLogic } from "~/lib/hooks/useTableLogic";
import { capitalizeFirst, cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const SKELETON_ROW_COUNT = 10;
const MIN_COLUMN_WIDTH = 140;
const EDITION_COLUMN_WIDTH = 168; // fits 2 buttons (if edition activated)

export function BaseTable<T>({
  data,
  columns,
  className,
  totalRow,
  fetchNextPage,
  onDelete,
  onEdit,
  features = { sorting: false, edition: false },
  onPress,
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

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const intrinsicColumnWidths = useColumnWidths({ columns });

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth((prev) =>
      prev !== null && Math.abs(prev - width) < 1 ? prev : width,
    );
  };

  const columnWidths = (() => {
    if (containerWidth == null) return intrinsicColumnWidths;
    const count = columns.length;
    const actionsWidth = features.edition ? EDITION_COLUMN_WIDTH : 0;
    const evenWidth = (containerWidth - actionsWidth) / count;
    return Array(count)
      .fill(0)
      .map(() => Math.max(MIN_COLUMN_WIDTH, evenWidth));
  })();

  const rowWidth =
    columnWidths.reduce((sum, w) => sum + w, 0) +
    (features.edition ? EDITION_COLUMN_WIDTH : 0);

  const needsHorizontalScroll =
    containerWidth != null && rowWidth > containerWidth + 1;

  const knownTotalPages = useRef(totalPages ?? 1);

  useEffect(() => {
    if (!isLoading) {
      knownTotalPages.current = totalPages ?? 1;
    }
  }, [totalPages, isLoading]);

  const stableTotalPages = isLoading
    ? knownTotalPages.current
    : (totalPages ?? 1);

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

  const renderRow = ({ item, index }: { item: any; index: number }) => {
    const { muted, disabled, tooltip } =
      props.getRowState?.(item.original) ?? {};

    const isRowClickable = !!onPress;
    const content = (
      <View
        className={cn(
          "flex-row",
          index % 2 === 0 ? "bg-muted" : "bg-background",
          muted && "opacity-50 line-through",
        )}
      >
        {item.getVisibleCells().map((cell: any, cellIndex: number) => (
          <View
            key={cell.id}
            style={{ width: columnWidths[cellIndex] }}
            className="p-2"
          >
            <Text
              className={cn(
                "flex-row",
                // index % 2 === 0 ? "bg-muted" : "bg-background",
                muted && "opacity-50 line-through",
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext()) ??
                (cell.getValue() as string | number | null)}
            </Text>
          </View>
        ))}
        {features.edition && (
          <View
            style={{ width: EDITION_COLUMN_WIDTH }}
            className="flex-row items-center justify-end gap-2 p-2"
          >
            <Button
              onPress={() => onEdit?.(item)}
              variant="outline"
              disabled={disabled}
            >
              <Icon as={Pencil} />
              <Text className="hidden lg:inline">
                {capitalizeFirst(t("common.edit"))}
              </Text>
            </Button>
            <Button
              onPress={() => onDelete?.(item)}
              variant="outline"
              disabled={disabled}
            >
              <Icon className="text-[hsl(var(--destructive))]" as={X} />
              <Text className="hidden lg:inline !text-[hsl(var(--destructive))]">
                {capitalizeFirst(t("common.delete"))}
              </Text>
            </Button>
          </View>
        )}
      </View>
    );
    const rowContent = !isRowClickable ? (
      content
    ) : (
      <Pressable
        disabled={disabled}
        onPress={() => {
          if (disabled) return;
          onPress(item.original.product_code, item.original.batch_number);
        }}
      >
        {content}
      </Pressable>
    );

    if (!tooltip) return rowContent;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{rowContent}</TooltipTrigger>
        <TooltipContent>
          <Text>{tooltip}</Text>
        </TooltipContent>
      </Tooltip>
    );
  };

  const skeletonData = Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => i);

  const renderSkeletonRow = (index: number) => (
    <View
      className={cn("flex-row", index % 2 === 0 ? "bg-muted" : "bg-background")}
    >
      {columnWidths.map((width, colIndex) => (
        <View key={colIndex} style={{ width }} className="p-2 justify-center">
          <Skeleton
            className="h-4 rounded"
            style={{
              width: `${75 + ((index + colIndex) % 3) * 10}%`,
            }}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View className={cn("flex-1", className)} onLayout={handleContainerLayout}>
      <ScrollView
        horizontal
        scrollEnabled={needsHorizontalScroll}
        showsHorizontalScrollIndicator={needsHorizontalScroll}
      >
        <FlatList<any>
          data={isLoading ? skeletonData : tableInstance.getRowModel().rows}
          keyExtractor={(item, index) =>
            isLoading ? `skeleton-${index}` : item.id
          }
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item, index }) =>
            isLoading ? renderSkeletonRow(index) : renderRow({ item, index })
          }
          style={{
            width: Math.max(rowWidth, containerWidth ?? rowWidth),
          }}
          scrollEnabled={!isLoading} // optional: avoid vertical scroll jitter while skeleton is up, remove if not needed
        />
      </ScrollView>

      {totalRow && (
        <View className="flex-row justify-between p-2 border-t border-border bg-background">
          <Text>{capitalizeFirst(t("common.total"))}</Text>
          <Text>{data.length}</Text>
        </View>
      )}

      {isPaginated && (
        <View className="flex-row items-center justify-center gap-4 pt-3">
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
