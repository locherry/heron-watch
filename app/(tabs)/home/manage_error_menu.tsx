import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { ErrorsAccordion } from "~/components/table/ErrorsAccordion";
import { Text } from "~/components/ui/text";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function ErrorMenu() {
  const [t] = useTranslation();
  const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: StockCategory;
  };

  //Fetch different products
  const { data, isLoading, isError } = useFetchQuery(
    "/api/known_errors",
    "get",
    {
      query: {
        stock_category: stockCategory,
      },
    },
  );
  return (
    <RootView>
      <Header
        title={capitalizeFirst(t("error_management_menu.title"))}
        className="mb-4"
      />
      <View className="">
        <Text variant={"h4"} className="text-center">
          {capitalizeFirst(t("error_management_menu.kown_errors"))}
        </Text>
      </View>
      <View className="border-2 rounded-xl border-[hsl(var(--border))]">
        <ErrorsAccordion data={data?.member} stockCategory={stockCategory} />
      </View>
    </RootView>
  );
}
