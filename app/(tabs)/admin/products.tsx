import { t } from "i18next";
import React, { useState } from "react";
import {
    ActivityIndicator,
    useWindowDimensions,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ProductCategoryTable } from "~/components/table/ProductCategoryTable";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { useInfiniteFetchQuery } from "~/lib/hooks/useInfiniteFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

type stockGlobalCategory = "PF" | "MP" | "EMB";

export default function App() {
    const [stockGlobalCategory, setStockGlobalCategory] = useState<stockGlobalCategory>("PF");
  const { data, isLoading, isError,fetchNextPage } = useInfiniteFetchQuery(
    "/productCategory/{stock_global_category}", 
    "get",
    {
        path : { stock_global_category : stockGlobalCategory },
        query : { limit : 10}
    }
);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Calculate the column widths dynamically based on screen width
  const columnWidths = React.useMemo(() => {
    const minColumnWidths = [120, 120, 180, 180];
    return minColumnWidths.map((minWidth) => {
      const evenWidth = width / minColumnWidths.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  if (isError) {
    return <Text>Error loading products</Text>;
  }

  return (
    <RootView>
    
    {/* Products */}
      <View className="flex-1">
        <Row className="flex-none">
          <H3>{capitalizeFirst(t("common.history"))}</H3>
        </Row>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          // <ActionTable
          //   data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
          //   fetchNextPage={fetchNextPage}
          // />

          <ProductCategoryTable
            // className="flex-1 h-full border-red-500 border-4"
            data={data?.pages.flatMap((page) => page.data ?? []) ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </View>
    </RootView>
  );
}
