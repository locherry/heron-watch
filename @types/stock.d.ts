
export type StockSortState = {
  order_by: 'id'| 'product_code'| 'lot_number'| 'quantity'| 'expiration_date',
  sort: "asc" | "desc";
};