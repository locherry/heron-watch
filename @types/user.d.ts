import { components } from "~/lib/swagger";

export type UserRead = components["schemas"]["User-user.read"];
export type UserWrite = components["schemas"]["User-user.write"];

export type UsersSortState = {
  order_by: "id" | "email" | "first_name" | "last_name" | "roles";
  sort: "asc" | "desc";
};

export type UserThemeValue = "dark" | "light" | "system";
export type UserRole = "ROLE_USER" | "ROLE_ADMIN";
