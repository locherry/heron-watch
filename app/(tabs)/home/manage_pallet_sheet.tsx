import { Link, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { Eye, Pencil, Plus } from "lucide-react-native";
import { View } from "react-native";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: StockCategory;
  };
  return (
    <RootView>
      <Header
        title={capitalizeFirst(t("manage_pallet_sheet"))}
        className="justify-between"
      >
        <Tooltip>
          <TooltipTrigger>
            <Icon as={constants.stockCategoryIcon[stockCategory]} />
          </TooltipTrigger>
          <TooltipContent>
            <Text>
              {capitalizeFirst(t("stocks.finishedProducts"))}
              {" - "}
              {t(("stocks." + stockCategory) as "stocks.PF_G")}
            </Text>
          </TooltipContent>
        </Tooltip>
      </Header>
      <View className="flex-1 align-center justify-center">
        <Row className="justify-center" gap={50}>
          <Link
            href={{
              pathname: "/home/add_pallet_sheet",
              params: { stockCategory: stockCategory },
            }}
            asChild
          >
            <Button className="h-40 w-40" size={"lg"} icon={Plus}>
              TEST
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/home/modify_pallet_sheet",
              params: { stockCategory: stockCategory },
            }}
            asChild
          >
            <Button className="h-40 w-40" size={"lg"} icon={Pencil} />
          </Link>
          <Link
            href={{
              pathname: "/home/view_pallet_sheet",
              params: { stockCategory: stockCategory },
            }}
            asChild
          >
            <Button className="h-40 w-40" size={"lg"} icon={Eye} />
          </Link>
        </Row>
      </View>
    </RootView>
  );
}
