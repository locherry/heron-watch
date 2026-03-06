import { components } from "~/lib/swagger";

export type ActionWrite = components["schemas"]["Action-action.write"];

export type ActionRead = components["schemas"]["Action-action.read"];

export type Action = components["schemas"]["Action"];

export type ActionSortState = {
  order_by:
    | "created_at"
    | "created_by_id"
    | "batch_number"
    | "action_id"
    | "product_code";
  sort: "asc" | "desc";
};

export type DraftAction = {
  id: number; // local only, for edit/delete tracking
  product_code: string;
  batch_number: string;
  quantity: number;
  action_category: number;
  expire_at: string;
  comment?: string;
  transaction_code?: string;
};
