import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { ActionSortState } from "~/@types/action";
import { BaseTableProps } from "~/@types/table";

type UseTableLogicProps<T> = Pick<
  BaseTableProps<T>,
  | "data"
  | "columns"
  | "features"
  | "hiddenColumns"
  | "onSortingChange"
  | "onEdit"
  | "onDelete"
  | "sorting"
>;

export function useTableLogic<T>({
  data,
  columns,
  features,
  sorting,
  hiddenColumns,
  onSortingChange,
  onEdit,
  onDelete,
}: UseTableLogicProps<T>) {
  const filteredColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns?.includes(col.id)),
    [columns, hiddenColumns]
  );

  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // 👈 enable sorting
    manualSorting: !!onSortingChange, // 👈 if you want server-side sorting
    state: {
      sorting: sorting
        ? [{ id: sorting.order_by, desc: sorting.sort === "desc" }]
        : [],
    },
    onSortingChange: (updater) => {
      if (!onSortingChange) return;

      const newState =
        typeof updater === "function"
          ? updater(
              sorting
                ? [{ id: sorting.order_by, desc: sorting.sort === "desc" }]
                : []
            )
          : updater;

      const newSorting = newState[0]
        ? {
            order_by: newState[0].id as ActionSortState["order_by"],
            sort: newState[0].desc ? "desc" : "asc",
          }
        : null;

      onSortingChange(newSorting);
    },
  });

  const toggleSort = useCallback(
    (columnId: string) => {
      if (!features?.sorting || !onSortingChange) return;
      onSortingChange(columnId);
    },
    [features?.sorting, onSortingChange]
  );

  const handleRowPress = useCallback(
    (item: T) => {
      if (features?.edition && (onEdit || onDelete)) {
        // Handle row selection/editing logic
      }
    },
    [features?.edition, onEdit, onDelete]
  );

  return {
    tableInstance,
    toggleSort,
    handleRowPress,
  };
}
