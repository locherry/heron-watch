import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, LayoutChangeEvent, View } from "react-native";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();
  const specificProduct = useLocalSearchParams();
  const { product_code, batch_number, stock_category } = specificProduct as {
    product_code: string;
    batch_number: string;
    stock_category: StockCategory;
  };

  console.log("Params received:", {
    product_code,
    batch_number,
    stock_category,
  });

  const { data, isLoading, isError } = useFetchQuery("/api/actions", "get", {
    query: {
      stock_category: stock_category,
      batch_number: batch_number,
    },
  });

  // Filter client-side by product_code and batch_number
  const filteredActions = data?.member?.filter(
    (item) =>
      item.product?.product_code === product_code &&
      item.batch_number === batch_number,
  );

  const [errorListDimension, setErrorListDimension] = useState<
    undefined | number
  >(undefined);
  const [errorsInput, setErrorsInput] = useState<{ [id: number]: number }>({});
  const [textInput, setTextInput] = useState<
    { [id: number]: [string, boolean] } | undefined
  >(undefined);
  const [totalStockQuantity, setTotalStockQuantity] = useState<number>(0);

  useEffect(() => {
    setErrorsInput((previousState) => {
      const newTab = { ...previousState };
      for (let i = 0; i < (filteredActions?.length ?? 0); i++) {
        if (filteredActions) {
          newTab[i] = filteredActions[i]?.quantity ?? 0;
        }
      }
      return newTab;
    });
  }, [data]);

  useEffect(() => {
    let newStockQuantity = 0;
    for (var value in errorsInput) {
      if (errorsInput[value]?.toString() === "-") {
        newStockQuantity += 0;
      } else {
        newStockQuantity += Number(errorsInput[value] ?? 0);
      }
    }
    setTotalStockQuantity(newStockQuantity);
  }, [errorsInput]);

  const handleLayout = (nativeEvent: LayoutChangeEvent) => {
    setErrorListDimension(nativeEvent.nativeEvent.layout.width);
  };

  const handleTypeInput = (text: string): boolean => {
    const number_pattern = /^-?\d+$/;
    const just_negative = /^-?$/;
    return number_pattern.test(text) || just_negative.test(text);
  };

  const handleDataFormating = (data: string): string => {
    const dataFormated = new Date(data);
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formatter.format(dataFormated);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View
      className={cn(
        "flex-row justify-around p-2 items-center",
        index % 2 === 0 ? "bg-muted" : "bg-background",
        "dark:bg-muted-dark dark:odd:bg-background-dark",
      )}
      onLayout={handleLayout}
    >
      <Text>{handleDataFormating(item.created_at)}</Text>
      <Text>
        {capitalizeFirst(item.createdBy?.first_name ?? "") +
          " " +
          capitalizeFirst(item.createdBy?.last_name ?? "")}
      </Text>
      <Input
        className={cn(
          "text-xl text-center",
          textInput?.[index] && !textInput[index][1]
            ? "border-destructive"
            : "",
        )}
        style={{ width: (errorListDimension ?? 0) / 6 }}
        value={
          textInput?.[index]
            ? textInput[index][0]
            : errorsInput[index]?.toString()
        }
        onChangeText={(text) => {
          if (handleTypeInput(text)) {
            const newTextInput = { ...textInput };
            newTextInput[index] = [text, true];
            setTextInput(newTextInput);

            const newTab = { ...errorsInput };
            newTab[index] = Number(text);
            setErrorsInput(() => newTab);
          } else {
            const newTextInput = { ...textInput };
            if (newTextInput[index]) {
              newTextInput[index][1] = false;
            }
            setTextInput(newTextInput);
          }
        }}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <RootView>
      <Header
        title={capitalizeFirst(t("errorManagementMenu.resolveError"))}
        className="mb4"
      />
      <View className="mr-5 ml-5">
        <Text variant={"h2"} className="flex justify-center">
          {capitalizeFirst(t("errorManagementMenu.listActionsWrongProduct"))}
        </Text>
        <View className="flex-row justify-around items-center">
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.createdAt"))}
          </Text>
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.createdBy"))}
          </Text>
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.quantity"))}
          </Text>
        </View>
        <View>
          <FlatList
            data={filteredActions}
            keyExtractor={(row) => String(row.id)}
            renderItem={renderItem}
          />
        </View>
      </View>
      <View className="items-center mt-20">
        <Row>
          <Text variant={"h3"}>
            {capitalizeFirst(t("errorManagementMenu.newQuantityAfterUpdate"))}
          </Text>
          <Text
            variant={"h3"}
            className="m-2 border-2 rounded-xl p-1 border-[hsl(var(--border))]"
          >
            {totalStockQuantity}
          </Text>
        </Row>
      </View>
    </RootView>
  );
}
