import { Link, useLocalSearchParams } from "expo-router";
import { Eye, Pencil, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();

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
            <Button variant="ghost">
              <Icon as={constants.stockCategoryIcon[stockCategory]} />
            </Button>
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
      <View className="items-center justify-center gap-3">
        <Link
          href={{
            pathname: "/home/pallet_sheets/new",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button className="w-40" size={"lg"} icon={Plus}>
            <Text>{capitalizeFirst(t("common.add"))}</Text>
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/home/pallet_sheets/edit",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button className="w-40" size={"lg"} icon={Pencil}>
            <Text>{capitalizeFirst(t("common.edit"))}</Text>
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/home/pallet_sheets/view",
            params: { stockCategory: stockCategory },
          }}
          asChild
        >
          <Button className="w-40" size={"lg"} icon={Eye}>
            <Text>{capitalizeFirst(t("common.view"))}</Text>
          </Button>
        </Link>
      </View>
    </RootView>
  );
}
