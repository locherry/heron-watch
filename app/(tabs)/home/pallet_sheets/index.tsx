import { Link, useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    LayoutChangeEvent,
    Pressable,
    useWindowDimensions,
    View,
} from "react-native";
import { StockCategory } from "~/@types/stock";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import QrScannerButton from "~/components/QrScannerButton";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import { PalletCard } from "~/components/ui/pallet-card";
import { Text } from "~/components/ui/text";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useBreakpoint } from "~/lib/hooks/useBreakpoint";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

type QrCodeItem = {
  id?: number;
  product_code?: string;
  batch_number?: string;
  quantity?: number;
};

export default function PalletSheetsHub() {
  const [t] = useTranslation();
  const { isSmallWidth } = useBreakpoint();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: StockCategory;
  };

  // --- Card grid sizing ---
  const PALLET_CARD_WIDTH = 170;
  const [numCol, setNumCol] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setNumCol(Math.floor(width / (PALLET_CARD_WIDTH + 30)));
  };
  const { width } = useWindowDimensions();

  // --- Search state ---
  const [productCodeValue, setProductCodeValue] = useState("");
  const [batchNumberValue, setBatchNumberValue] = useState("");
  const [dynamicProductCodeValue, setDynamicProductCodeValue] = useState("");
  const [dynamicBatchNumberValue, setDynamicBatchNumberValue] = useState("");

  const isSelectingPC = useRef(false);
  const isSelectingLN = useRef(false);

  const { data: ProductCodeData } = useFetchQuery("/api/qr_codes", "get", {
    query: {
      stock_category: stockCategory,
      ...(batchNumberValue !== "" ? { batch_number: batchNumberValue } : {}),
    },
  });

  const { data: BatchNumberData } = useFetchQuery("/api/qr_codes", "get", {
    query: {
      stock_category: stockCategory,
      ...(productCodeValue !== "" ? { product_code: productCodeValue } : {}),
    },
  });

  const { data: selectedPalletsData, isLoading: isResultsLoading } =
    useFetchQuery(
      "/api/qr_codes",
      "get",
      {
        query: {
          stock_category: stockCategory,
          product_code: productCodeValue,
          batch_number: batchNumberValue,
        },
      },
      undefined,
      productCodeValue !== "" && batchNumberValue !== "",
    );

  const [PCfilteredData, setPCFilteredData] = useState<QrCodeItem[]>([]);
  const [BNfilteredData, setBNFilteredData] = useState<QrCodeItem[]>([]);

  useEffect(() => {
    const members = (ProductCodeData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    setPCFilteredData(
      members.filter((line) => {
        const code = line.product_code ?? "";
        if (seen.has(code) || !code.includes(dynamicProductCodeValue))
          return false;
        seen.add(code);
        return true;
      }),
    );
  }, [dynamicProductCodeValue, ProductCodeData]);

  useEffect(() => {
    const members = (BatchNumberData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    setBNFilteredData(
      members.filter((line) => {
        const bn = line.batch_number ?? "";
        if (seen.has(bn) || !bn.includes(dynamicBatchNumberValue)) return false;
        seen.add(bn);
        return true;
      }),
    );
  }, [dynamicBatchNumberValue, BatchNumberData]);

  const hasSearch = productCodeValue !== "" && batchNumberValue !== "";

  return (
    <RootView>
      <FlatList
        focusable={false}
        data={[]}
        keyExtractor={(_, i) => i.toString()}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Header
              title={capitalizeFirst(t("manage_pallet_sheets"))}
              shortTitle={capitalizeFirst(t("pallet_sheets"))}
              className="justify-between mb-2"
            >
              <Row gap={8}>
                <Link
                  href={{
                    pathname: "/home/pallet_sheets/new",
                    params: { stockCategory },
                  }}
                  asChild
                >
                  <Button icon={Plus}>
                    {!isSmallWidth
                      ? capitalizeFirst(t("common.add"))
                      : undefined}
                  </Button>
                </Link>
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
              </Row>
            </Header>

            {/* Quick jump via QR */}
            <Row className="w-full justify-center mb-4">
              <QrScannerButton
                onScan={(data) => {
                  // Navigate straight into edit for the scanned sheet
                }}
              >
                {capitalizeFirst(t("modify_pallet_sheet.scan_existing_sheet"))}
              </QrScannerButton>
            </Row>

            {/* Search */}
            <View className="z-20">
              <Label className="text-base">
                {capitalizeFirst(t("actions.product_code"))}
              </Label>
              <AutocompleteInput
                data={PCfilteredData.map((qr) => ({
                  label: qr.product_code ?? "",
                  value: qr.product_code ?? "",
                }))}
                value={dynamicProductCodeValue}
                onChangeText={(text) => {
                  if (productCodeValue !== "") setProductCodeValue("");
                  setDynamicProductCodeValue(text);
                }}
                onSelect={(item) => {
                  setProductCodeValue(item.value);
                  setDynamicProductCodeValue(item.value);
                }}
                placeholder={t("actions.product_code")}
              />
            </View>
            <View className="z-10">
              <Label className="text-base">
                {capitalizeFirst(t("actions.batch_number"))}
              </Label>
              <AutocompleteInput
                data={BNfilteredData.map((qr) => ({
                  label: qr.batch_number ?? "",
                  value: qr.batch_number ?? "",
                }))}
                value={dynamicBatchNumberValue}
                onChangeText={(text) => {
                  if (batchNumberValue !== "") setBatchNumberValue("");
                  setDynamicBatchNumberValue(text);
                }}
                onSelect={(item) => {
                  setBatchNumberValue(item.value);
                  setDynamicBatchNumberValue(item.value);
                }}
                placeholder={t("actions.batch_number")}
              />
            </View>

            {/* Results */}
            <View className="mt-5">
              {!hasSearch ? (
                <Text className="text-center text-muted-foreground mt-4">
                  {capitalizeFirst(t("add_pallet_sheet.select_a_product"))}
                </Text>
              ) : (
                <FlatList
                  key={numCol}
                  keyExtractor={(_item: unknown, index: number) =>
                    `pallet-${index}`
                  }
                  data={(selectedPalletsData?.member as QrCodeItem[]) ?? []}
                  numColumns={numCol}
                  onLayout={handleLayout}
                  renderItem={({ item }: { item: unknown }) => {
                    const qr = item as QrCodeItem;
                    return (
                      <Link
                        href={{
                          pathname: "/home/pallet_sheets/edit",
                          params: {
                            stockCategory,
                            alreadySetQrId: qr.id,
                          },
                        }}
                        asChild
                      >
                        {qr.id && qr.quantity && (
                          <Pressable>
                            <PalletCard
                              objId={qr.id}
                              objQuantity={qr.quantity}
                            />
                          </Pressable>
                        )}
                      </Link>
                    );
                  }}
                />
              )}
            </View>
          </>
        }
      />
    </RootView>
  );
}
