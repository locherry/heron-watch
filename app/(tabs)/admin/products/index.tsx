import { Row } from "@tanstack/react-table";
import { Link } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { ProductRead, ProductSortState } from "~/@types/product";
import { Alert } from "~/components/alert/Alert";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { ProductTable } from "~/components/table/ProductTable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "~/components/ui/toggle-group";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();

  const [stockGroup, setStockGroup] = useState<["PF", "MP", "EMB"][number]>(
    constants.stockGroups[0],
  );
  const [sorting, setSorting] = useState<ProductSortState | null>(null); // State for sorting order and criteria
  const [page, setPage] = useState(1);

  // Reset page when category, or sorting changes
  useEffect(() => {
    setPage(1);
  }, [stockGroup, sorting]);

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

  const { mutate: deleteProduct } = useFetchMutation(
    "/api/products/{id}",
    "delete",
    {
      onSuccess: () => refetch(),
    },
  );

  const totalItems = data?.["totalItems"] ?? 0;
  const totalPages = Math.ceil(totalItems / 10);

  if (isError) {
    return <Text>Error loading products</Text>;
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
          id && deleteProduct({ params: { path: { id: id.toString() } } }),
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

      <Text>{capitalizeFirst(t("stocks.stockGroup"))}</Text>
      <ToggleGroup
        value={stockGroup}
        onValueChange={(val) => {
          if (val) setStockGroup(val as typeof stockGroup);
        }}
        variant="outline"
        type="single"
      >
        {(["PF", "MP", "EMB"] as const).map((cat, i) => (
          <ToggleGroupItem
            key={cat}
            value={cat}
            isFirst={i === 0}
            isLast={i === 2}
          >
            <ToggleGroupIcon as={Package} />
            <Text>{capitalizeFirst(t(`stocks.${cat}` as const))}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ProductTable
        className="z-0"
        data={data?.["member"] ?? []}
        sorting={sorting}
        onSortingChange={setSorting}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        editEnabled={true}
        onEdit={() =>
          Toast.show({
            type: "info",
            text1: "TODO : implement link with backend",
            text2: "hello",
          })
        }
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </RootView>
  );
}
