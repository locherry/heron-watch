import { create } from "zustand";
import { StockCategory } from "~/@types/stock";

export type DraftAction = {
  id: number;
  product_code: string;
  batch_number: string;
  quantity: number;
  action_category: number;
  expire_at: string;
  comment?: string;
  transaction_code?: string;
};

type DraftActionsStore = {
  actions: DraftAction[];
  stockCategory: StockCategory;
  setStockCategory: (cat: StockCategory) => void;
  addAction: (action: Omit<DraftAction, "id">) => void;
  editAction: (id: number, action: Omit<DraftAction, "id">) => void;
  deleteAction: (id: number) => void;
  clearActions: () => void;
};

export const useDraftActionsStore = create<DraftActionsStore>((set, get) => ({
  actions: [],
  stockCategory: "PF_G",
  setStockCategory: (stockCategory) => set({ stockCategory }),
  addAction: (action) => {
    const maxId =
      get().actions.length > 0
        ? Math.max(...get().actions.map((a) => a.id))
        : 0;
    set((state) => ({
      actions: [...state.actions, { ...action, id: maxId + 1 }],
    }));
  },
  editAction: (id, updated) =>
    set((state) => ({
      actions: state.actions.map((a) => (a.id === id ? { ...updated, id } : a)),
    })),
  deleteAction: (id) =>
    set((state) => ({ actions: state.actions.filter((a) => a.id !== id) })),
  clearActions: () => set({ actions: [] }),
}));
