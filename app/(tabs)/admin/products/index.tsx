import { Row } from "@tanstack/react-table";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductRead } from "~/@types/product";
import { UsersSortState } from "~/@types/user";
import { Alert } from "~/components/alert/Alert";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { ProductTable } from "~/components/table/ProductTable";
import ToggleStock from "~/components/ToggleStock";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();

  const [stockGroup, setStockGroup] = useState<
    (typeof constants.stockGroups)[number]
  >(constants.stockGroups[0]);
  const [stockCategory, setStockCategory] = useState<
    (typeof constants.stockCategories)[number]
  >(constants.stockCategories[0]);
  const [sorting, setSorting] = useState<UsersSortState | null>(null); // State for sorting order and criteria
  const [page, setPage] = useState(1);

  // Reset page when category, or sorting changes
  useEffect(() => {
    setPage(1);
  }, [stockCategory, sorting]);

  const { data, isLoading, isError, error, refetch } = useFetchQuery(
    "/api/products",
    "get",
    {
      query: {
        stock_group: stockGroup,
        page,
        ...(sorting ? { [`order[${sorting.order_by}]`]: sorting.sort } : {}),
      },
    },
  );

  const { mutate: deleteUser } = useFetchMutation("/api/users/{id}", "delete", {
    onSuccess: () => refetch(),
  });

  const totalItems = data?.["totalItems"] ?? 0;
  const totalPages = Math.ceil(totalItems / 10);

  if (isError) {
    return <Text>Error loading users</Text>;
  }

  const handleDelete = (row: Row<ProductRead>) => {
    const id = row.original.id;
    Alert.alert(t("Please confirm"), t("product.confirmDelete"), [
      {
        text: t("common.cancel"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: t("common.OK"),
        onPress: () =>
          id && deleteUser({ params: { path: { id: id.toString() } } }),
      },
    ]);
  };

  return (
    <RootView>
      <Header title={capitalizeFirst(t("common.products"))}>
        <Link href={"/admin/products/new"} asChild>
          <Button
            className="ml-auto"
            variant="outline"
            icon={Plus}
            onPress={() => console.log("Add Product")}
          >
            <Text>{capitalizeFirst(t("product.newProduct"))}</Text>
          </Button>
        </Link>
      </Header>

      <ToggleStock
        stockGroup={stockGroup}
        stockCategory={stockCategory}
        onStockCategoryChange={setStockCategory}
        onStockGroupChange={setStockGroup}
      />

      <ProductTable
        className="z-0"
        data={data?.["member"] ?? []}
        sorting={sorting}
        onSortingChange={setSorting}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        editEnabled={true}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </RootView>
  );
}
