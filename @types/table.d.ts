import { ColumnDef } from "@tanstack/react-table";

export interface TableFeatures {
  sorting?: boolean;
  pagination?: boolean;
  selection?: boolean;
  edition?: boolean;
}

import { Row } from "@tanstack/react-table";
export interface BaseTableProps<T> extends ViewProps {
  data: T[];
  columns: ColumnDef<T>[];
  features?: Partial<TableFeatures>;
  hiddenColumns?: string[];
  totalRow?: boolean;
  sorting?: ActionSortState | null;
  onSortingChange?: (newSorting: ActionSortState | null) => void;
  editEnabled?: boolean;
  onDelete?: (item: Row<T>) => void;
  onEdit?: (item: Row<T>) => void;
  fetchNextPage?: () => void;
  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  fixedWidth?: number;
  onPress?: (...args: any[]) => void;
  isLoading?: boolean;
  getRowState?: (item: T) => RowState;
}

export type RowState = {
  muted?: boolean; // greys the row out
  disabled?: boolean; // blocks press + edit/delete
  tooltip?: string; // shown on hover when the row needs an explanation (eg : corrected actions)
};
