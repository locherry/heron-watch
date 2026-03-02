import { components } from "~/lib/swagger";

export type StockRead = components["schemas"]["Stock-stock.read"];
export type StockWrite = components["schemas"]["Stock-stock.write"];

export type StockSortState = {
  order_by:
    | "id"
    | "product_code"
    | "batch_number"
    | "quantity"
    | "expiration_date";
  sort: "asc" | "desc";
};

export type StockCategory = "PF_G" | "PF_M" | "MP_F" | "MP_S" | "MP_C" | "EMB";
