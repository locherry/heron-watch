import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { constants } from "~/lib/constants";
import { capitalizeFirst, cn } from "~/lib/utils";
import Row from "./layout/Row";
import { Icon } from "./ui/icon";
import {
    MaterialTabs,
    MaterialTabsList,
    MaterialTabsTrigger,
} from "./ui/material-tabs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Text } from "./ui/text";

type StockGroup = "PF" | "MP";
type StockCategory = (typeof constants.stockCategories)[number];

type StockCategoryTab = {
  stock_category: StockCategory;
  icon: LucideIcon;
  name: string;
};

const stockCategoryTabs: Record<StockGroup, StockCategoryTab[]> = {
  PF: [
    {
      stock_category: "PF_G",
      icon: constants.stockCategoryIcon.PF_G,
      name: "cannery",
    },
    {
      stock_category: "PF_M",
      icon: constants.stockCategoryIcon.PF_M,
      name: "store",
    },
  ],
  MP: [
    {
      stock_category: "MP_F",
      icon: constants.stockCategoryIcon.MP_F,
      name: "fresh",
    },
    {
      stock_category: "MP_S",
      icon: constants.stockCategoryIcon.MP_S,
      name: "dry",
    },
    {
      stock_category: "MP_C",
      icon: constants.stockCategoryIcon.MP_C,
      name: "frozen",
    },
    {
      stock_category: "EMB",
      icon: constants.stockCategoryIcon.EMB,
      name: "packaging",
    },
  ],
};

type ToggleStockProps = {
  className?: string;
  stockGroup: StockGroup;
  stockCategory: StockCategory;
  onStockGroupChange: (group: StockGroup) => void;
  onStockCategoryChange: (category: StockCategory) => void;
};

export default function ToggleStock({
  className,
  stockGroup,
  stockCategory,
  onStockGroupChange,
  onStockCategoryChange,
}: ToggleStockProps) {
  const [t] = useTranslation();

  return (
    <Row className={cn("flex-col items-start", className)}>
      <MaterialTabs
        className="mb-2"
        value={stockGroup}
        onValueChange={(v) => {
          const newGroup = v as StockGroup;
          onStockGroupChange(newGroup);
          // Auto-select the first category of the new group
          onStockCategoryChange(stockCategoryTabs[newGroup][0]!.stock_category);
        }}
      >
        <MaterialTabsList>
          <MaterialTabsTrigger
            value="MP"
            disabled={process.env.EXPO_PUBLIC_MP_DISABLED === "true"}
          >
            {capitalizeFirst(t("stocks.rawMaterials"))}
          </MaterialTabsTrigger>
          <MaterialTabsTrigger value="PF">
            {capitalizeFirst(t("stocks.finishedProducts"))}
          </MaterialTabsTrigger>
        </MaterialTabsList>
      </MaterialTabs>

      <Tabs
        value={stockCategory}
        onValueChange={(v) => onStockCategoryChange(v as StockCategory)}
        className="w-full max-w-[500px] flex-col gap-1.5 mb-2"
      >
        <TabsList className="flex-row w-full">
          {stockCategoryTabs[stockGroup].map((tab) => {
            const isActive = tab.stock_category === stockCategory;
            return (
              <TabsTrigger
                key={tab.stock_category}
                value={tab.stock_category}
                className="flex-1 cursor-pointer"
              >
                <Row className="flex-1 justify-center">
                  <Icon
                    as={tab.icon}
                    className={cn(
                      "h-4 w-4 mr-2",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <Text
                    className={cn(
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {capitalizeFirst(t(`stocks.${tab.name}` as any))}
                  </Text>
                </Row>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </Row>
  );
}
