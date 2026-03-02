import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
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
  hiddenColumns,
  sorting,
  onSortingChange,
  onEdit,
  onDelete,
}: UseTableLogicProps<T>) {
  // --- Filter columns (respect hiddenColumns) ---
  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (col): col is typeof col & { id: string } =>
          col.id !== undefined && !hiddenColumns?.includes(col.id),
      ),
    [columns, hiddenColumns],
  );
  // --- Controlled or local sorting state ---
  const [localSorting, setLocalSorting] = useState<SortingState>([]);

  const currentSorting: SortingState = useMemo(() => {
    return sorting
      ? [
          {
            id: sorting.order_by,
            desc: sorting.sort === "desc",
          },
        ]
      : localSorting;
  }, [sorting, localSorting]);

  // --- Handle sorting change ---
  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updater === "function" ? updater(currentSorting) : updater;

      if (onSortingChange) {
        const first = newSorting[0];
        onSortingChange(
          first
            ? {
                order_by: first.id as ActionSortState["order_by"],
                sort: first.desc ? "desc" : "asc",
              }
            : null,
        );
      } else {
        setLocalSorting(newSorting);
      }
    },
    [onSortingChange, currentSorting],
  );

  // --- Create the table instance ---
  const tableInstance = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: !!onSortingChange,
    state: {
      sorting: currentSorting,
    },
    onSortingChange: handleSortingChange,
  });

  // --- Toggle sort for column by ID ---
  const toggleSort = useCallback(
    (columnId: string) => {
      const column = tableInstance.getColumn(columnId);
      column?.toggleSorting(column.getIsSorted() === "asc");
    },
    [tableInstance],
  );

  // --- Optional row handler ---
  const handleRowPress = useCallback(
    (item: T) => {
      if (features?.edition && (onEdit || onDelete)) {
        // You can call onEdit(item) or onDelete(item) here if needed
      }
    },
    [features?.edition, onEdit, onDelete],
  );

  return {
    tableInstance,
    toggleSort,
    handleRowPress,
  };
}
