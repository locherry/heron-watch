import { components } from "~/lib/swagger";

export type UserRead = components["schemas"]["User-user.read"];
export type UserUpdate = components["schemas"]["User-user.update"];
// export type UserWrite = components["schemas"]["User-user.write"];

export type UsersSortState = {
  order_by: "id" | "email" | "first_name" | "last_name" | "roles";
  sort: "asc" | "desc";
};

export type UserTheme = NonNullable<UserRead["preferences"]>["theme"];
export type UserLanguage = NonNullable<UserRead["preferences"]>["language"];
