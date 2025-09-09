export type Stock = {
  id: number;
  product_code: string;
  lot_number: string;
  quantity: number;
  expiration_date: string; // ISO string or any date representation
};

export type StockSortState = {
  order_by: "id" | "product_code" | "lot_number" | "quantity" | "expiration_date";
  sort: "asc" | "desc";
};
