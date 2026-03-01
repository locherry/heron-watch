import { components } from "~/lib/swagger";

export type ActionWrite = components["schemas"]["Action-action.write"];

export type ActionRead = components["schemas"]["Action-action.read"];

export type ActionSortState = {
  order_by:
    | "created_at"
    | "created_by_id"
    | "batch_number"
    | "action_id"
    | "product_code";
  sort: "asc" | "desc";
};
