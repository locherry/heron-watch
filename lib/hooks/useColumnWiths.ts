import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { BaseColumnDef } from "~/@types/table";

export function useColumnWidths<T>({
  columns,
}: {
  columns: BaseColumnDef<T>[];
}) {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const count = columns.length;
    return new Array(count).fill(0).map(() => Math.max(140, width / count));
  }, [width, columns]);
}
