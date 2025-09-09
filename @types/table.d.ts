export interface BaseColumnDef<T> {
  id: string;
  accessorKey: keyof T;
  header: () => string;
}

export interface TableFeatures {
  sorting?: boolean;
  pagination?: boolean;
  selection?: boolean;
  edition?: boolean;
}

export interface BaseTableProps<T> extends ViewProps {
  data: T[];
  columns: BaseColumnDef<T>[];
  features?: Partial<TableFeatures>;
  hiddenColumns?: string[];
  totalRow?: boolean;
  sorting?: ActionSortState | null;
  onSortingChange?: (newSorting: ActionSortState | null) => void;
  editEnabled?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  fetchNextPage?: () => void;
  className?: string;
}
