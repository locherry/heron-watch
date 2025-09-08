
export type Action = {
  id: number;
  quantity: number;
  comment: string;
  product_code: string;
  lot_number: string;
  created_by_id: number;
  created_at: string;
  action_id: number;
  transaction: string;
};

export type ActionSortState = {
  order_by: "created_at" | "created_by_id" | "lot_number" | "action_id" | "product_code";
  sort: "asc" | "desc";
};