import { create } from "zustand";
import { ActionSortState } from "~/@types/action";
import { TableFilterValue } from "~/components/table/TableFilter";

const defaultSorting: ActionSortState = {
  order_by: "created_at",
  sort: "desc",
};

type ActionsFilterStore = {
  sorting: ActionSortState | null;
  page: number;
  filters: TableFilterValue;
  setSorting: (sorting: ActionSortState | null) => void;
  setPage: (page: number) => void;
  setFilters: (filters: TableFilterValue) => void;
  resetFilters: () => void;
};

export const useActionsFilterStore = create<ActionsFilterStore>((set) => ({
  sorting: defaultSorting,
  page: 1,
  filters: {},
  setSorting: (sorting) => set({ sorting }),
  setPage: (page) => set({ page }),
  setFilters: (filters) => set({ filters, page: 1 }),
  resetFilters: () => set({ filters: {}, page: 1 }),
}));
