export type Action = {
  id: number | string;
  quantity: number;
  comment?: string;
  product_code?: number;
  lot_number?: string;
  created_by_id?: number;
  created_at?: string;
  action_id?: number;
  transaction?: string;
};
