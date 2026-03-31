import { components } from "~/lib/swagger";

export type Product = components["schemas"]["Product"];
export type ProductRead = components["schemas"]["Product-product.read"];
export type ProductSortState = {
  order_by: "id" | "product_name" | "product_code" | "product_category";
  sort: "asc" | "desc";
};
