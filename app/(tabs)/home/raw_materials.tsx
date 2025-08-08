import { t } from "i18next";
import * as React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { Leaf } from "~/lib/icons/Leaf";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";
import { ServerCrash } from "~/lib/icons/ServerCrash";
import { Snowflake } from "~/lib/icons/Snowflake";
import { Sun } from "~/lib/icons/Sun";
import { useFetchQuery } from "~/lib/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function TabsScreen() {
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

  const stocksTabs = [
    { name: "fresh", icon: Leaf, data: "MP_F" },
    { name: "dry", icon: Sun, data: "MP_S" },
    { name: "frozen", icon: Snowflake, data: "MP_C" },
    { name: "packaging", icon: Package, data: "EMB" },
  ] satisfies {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    data: ["MP_F", "MP_S", "MP_C", "EMB"][number];
  }[];
  const [currentTabName, setCurrentTabName] = React.useState(
    stocksTabs[0].name
  );
  let stockIdentifier =
    (stocksTabs.find((tab) => tab.name === currentTabName)
      ?.data as (typeof stocksTabs)[number]["data"]) ?? "MP_F";
  const { data, error, isLoading, isError } = useFetchQuery(
    "/actions/{stock_category}",
    "get",
    { path: { stock_category: stockIdentifier } }
  );
  if (isError) {
    console.log(error.message);
  }
  if (!isLoading) {
    return (
      <RootView>
        <H3>{capitalizeFirst(t("stocks.rawMaterials"))}</H3>
        <Tabs
          value={currentTabName}
          onValueChange={setCurrentTabName}
          className="w-full max-w-[400px] flex-col gap-1.5 mb-2"
        >
          <TabsList className="flex-row w-full">
            {stocksTabs.map((tab) => (
              <TabsTrigger value={tab.name} className="flex-1" key={tab.name}>
                <Row>
                  {React.createElement(tab.icon, {
                    className: `h-4 w-4 mr-2 ${
                      tab.name === currentTabName
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`,
                  })}
                  <Text>{capitalizeFirst(t("stocks." + tab.name))}</Text>
                </Row>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <View className="flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <Button icon={Package} variant="outline">
            {capitalizeFirst(t("stocks.viewStocks"))}
          </Button>
          <Button icon={Plus} variant="outline">
            {t("New actions")}
          </Button>
          <Button icon={ServerCrash} variant="outline">
            {t("Manage Errors")}
          </Button>
        </View>
        <View>
          <Row className="flex-none">
            <H3>{capitalizeFirst(t("common.history"))}</H3>
          </Row>
          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
          >
            <Table aria-labelledby="action-table">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: columnWidths[0] }}>
                    <Text>{capitalizeFirst(t("actions.id"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[1] }}>
                    <Text>{capitalizeFirst(t("actions.quantity"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[2] }}>
                    <Text>{capitalizeFirst(t("actions.comment"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[3] }}>
                    <Text>{capitalizeFirst(t("actions.product_code"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[4] }}>
                    <Text>{capitalizeFirst(t("actions.lot_number"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[5] }}>
                    <Text>{capitalizeFirst(t("actions.created_by_id"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[6] }}>
                    <Text>{capitalizeFirst(t("actions.created_at"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[7] }}>
                    <Text>{capitalizeFirst(t("actions.action_id"))}</Text>
                  </TableHead>
                  <TableHead style={{ width: columnWidths[8] }}>
                    <Text>{capitalizeFirst(t("actions.transaction"))}</Text>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Using map to render each user row */}
                {data?.data?.map((actions, index) => (
                  <TableRow
                    key={actions.id}
                    className={index % 2 ? "bg-muted/40" : ""}
                  >
                    <TableCell style={{ width: columnWidths[0] }}>
                      <Text>{actions.id}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[1] }}>
                      <Text>{actions.quantity}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[2] }}>
                      <Text>{actions.comment}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[3] }}>
                      <Text>{actions.product_code}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[4] }}>
                      <Text>{actions.lot_number}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[5] }}>
                      <Text>{actions.created_by_id}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[6] }}>
                      <Text>{actions.created_at}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[7] }}>
                      <Text>{actions.action_id}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[8] }}>
                      <Text>{actions.transaction}</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell className="flex-1 justify-center">
                    <Text className="text-foreground">Total Users</Text>
                  </TableCell>
                  <TableCell className="items-end pr-8">
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => t(`Total actions: ${data?.data?.length}`)}
                    >
                      <Text>{data?.data?.length}</Text>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollView>
        </View>
      </RootView>
    );
  }
}
