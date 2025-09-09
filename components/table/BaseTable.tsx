import { flexRender } from "@tanstack/react-table";
import { FlatList, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BaseTableProps } from "~/@types/table";
import { ChevronDown } from "~/assets/images/icons/ChevronDown";
import { ChevronUp } from "~/assets/images/icons/ChevronUp";
import { useColumnWidths } from "~/lib/hooks/useColumnWiths";
import { useTableLogic } from "~/lib/hooks/useTableLogic";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";

export function BaseTable<T>({
  data,
  columns,
  className,
  totalRow,
  fetchNextPage,
  ...props
}: BaseTableProps<T>) {
  const { tableInstance, toggleSort } = useTableLogic({
    data,
    columns,
    ...props,
  });

  const columnWidths = useColumnWidths({ columns });

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
                      header.getContext()
                    )}
                  </Text>
                  {{
                    asc: <ChevronUp className="text-foreground" />,
                    desc: <ChevronDown className="text-foreground" />,
                  }[header.column.getIsSorted() as "asc" | "desc"] ?? null}
                </View>
              </Pressable>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderRow = ({ item }: { item: any }) => (
    <View className="flex-row">
      {item.getVisibleCells().map((cell: any, index: number) => (
        <View
          key={cell.id}
          style={{ width: columnWidths[index] }}
          className="p-2"
        >
          <Text>
            {flexRender(cell.column.columnDef.cell, cell.getContext()) ??
              (cell.getValue() as string | number | null)}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className={cn("flex-1", className)}>
      <ScrollView horizontal>
        <View>
          {renderHeader()}
          <FlatList
            data={tableInstance.getRowModel().rows}
            keyExtractor={(row) => row.id}
            renderItem={renderRow}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.5}
          />
        </View>
      </ScrollView>

      {totalRow && (
        <View className="flex-row justify-between p-2 border-t border-border">
          <Text>Total rows</Text>
          <Text>{data.length}</Text>
        </View>
      )}
    </View>
  );
}
