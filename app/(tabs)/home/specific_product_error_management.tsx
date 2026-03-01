import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    LayoutChangeEvent,
    useWindowDimensions,
    View,
} from "react-native";
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
  const dimensions = useWindowDimensions();
  const { product_code, batch_number, stock_category } = specificProduct as {
    product_code: string;
    batch_number: string;
    stock_category: StockCategory;
  };
  const { data, isLoading, isError } = useFetchQuery(
    "/actions_and_users/{stock_category}",
    "get",
    {
      path: { stock_category: stock_category },
      query: {
        filter_params: {
          product_code: product_code,
          batch_number: batch_number,
        },
        required_elts: [
          "id",
          "first_name",
          "last_name",
          "quantity",
          "created_at",
        ],
      },
    },
  );
  const [errorListDimension, setErrorListDimension] = useState<
    undefined | number
  >(undefined);
  const [errorsInput, setErrorsInput] = useState<{ [id: number]: number }>({});
  const [textInput, setTextInput] = useState<
    { [id: number]: [string, boolean] } | undefined
  >(undefined);
  const [totalStockQuantity, setTotalStockQuantity] = useState<number>(0);
  //Array to stock all error's inputs
  useEffect(() => {
    setErrorsInput((previousState) => {
      const newTab = { ...previousState };
      for (let i = 0; i < (data?.data?.length ?? 0); i++) {
        if (data?.data) {
          newTab[i] = data?.data[i]?.quantity ?? 0;
        }
      }
      return newTab;
    });
    console.log(data);
  }, [data]);
  useEffect(() => {
    let newStockQuantity: number = 0;
    for (var value in errorsInput) {
      if (errorsInput) {
        if (errorsInput[value]) {
          if (errorsInput[value]?.toString() == "-") {
            newStockQuantity += 0;
          } else {
            newStockQuantity += Number(errorsInput[value]);
          }
        } else {
          newStockQuantity += 0;
        }
      } else {
        newStockQuantity += 0;
      }
    }
    setTotalStockQuantity(newStockQuantity);
  }, [errorsInput]);
  const handleLayout = (nativeEvent: LayoutChangeEvent) => {
    setErrorListDimension(nativeEvent.nativeEvent.layout.width);
  };
  const handleTypeInput = (text: string): boolean => {
    //Apply regexp
    let number_pattern: RegExp = /^-?\d+$/;
    let just_negative: RegExp = /^-?$/;
    if (number_pattern.test(text) || just_negative.test(text)) {
      return true;
    } else {
      return false;
    }
  };
  const handleDataFormating = (data: string): string => {
    let dataFormated: Date = new Date(data);
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
        {capitalizeFirst(item.first_name) +
          " " +
          capitalizeFirst(item.last_name)}
      </Text>
      <Input
        className={cn(
          "text-xl text-center",
          textInput
            ? textInput[index]
              ? !textInput[index][1]
                ? "border-destructive"
                : ""
              : ""
            : "",
        )}
        style={{ width: (errorListDimension ?? 0) / 6 }}
        value={
          textInput
            ? textInput[index]
              ? textInput[index][0]
              : errorsInput[index]?.toString()
            : errorsInput[index]?.toString()
        }
        onChangeText={(text) => {
          if (handleTypeInput(text)) {
            //Change de previous correct text
            const newTextInput = { ...textInput };
            newTextInput[index] = [text, true];
            setTextInput(newTextInput);

            //Change inputs to the new corrects one, and calculate the new stock quantity displayed.
            const newTab = { ...errorsInput };
            newTab[index] = Number(text);
            setErrorsInput((previousState) => newTab);
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
        title={capitalizeFirst(t("error_management_menu.resolve_error"))}
        className="mb4"
      />
      <View className="mr-5 ml-5">
        <Text variant={"h2"} className="flex justify-center">
          {capitalizeFirst(
            t("error_management_menu.list_actions_wrong_product"),
          )}
        </Text>
        <View className="flex-row justify-around items-center">
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.created_at"))}
          </Text>
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.created_by_id"))}
          </Text>
          <Text variant={"h4"} className="p-2">
            {capitalizeFirst(t("actions.quantity"))}
          </Text>
        </View>
        <View>
          <FlatList
            data={data?.data}
            keyExtractor={(row) => row.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
      <View className="items-center mt-20">
        <Row>
          <Text variant={"h3"}>
            {capitalizeFirst(
              t("error_management_menu.new_quantity_after_update"),
            )}
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
