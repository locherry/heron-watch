import { components } from "~/lib/swagger";

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
