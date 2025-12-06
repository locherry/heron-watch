import { ColumnDef } from '@tanstack/react-table';

export interface TableFeatures {
  sorting?: boolean;
  pagination?: boolean;
  selection?: boolean;
  edition?: boolean;
}

export interface BaseTableProps<T> extends ViewProps {
  data: T[];
  columns: ColumnDef<T>[];
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
  fixedWidth? : number;
  onPress? : (...args : any[]) => void;
}
