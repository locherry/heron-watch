import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Label } from "~/components/ui/label";
import { PalletCard } from "~/components/ui/pallet-card";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

type QrCodeItem = {
  id?: number;
  product_code?: string;
  batch_number?: string;
  quantity?: number;
};

export default function App() {
  const PALLET_CARD_WIDTH = 170;
  const [numCol, setNumCol] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setNumCol(Math.floor(width / (PALLET_CARD_WIDTH + 30)));
  };
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";
  };

  const [productCodeValue, setProductCodeValue] = useState("");
  const [batchNumberValue, setBatchNumberValue] = useState("");
  const [dynamicProductCodeValue, setDynamicProductCodeValue] = useState("");
  const [dynamicBatchNumberValue, setDynamicBatchNumberValue] = useState("");

  const isSelectingPC = useRef(false);
  const isSelectingLN = useRef(false);

  const { data: ProductCodeData } = useFetchQuery("/api/qr_codes", "get", {
    query: batchNumberValue !== "" ? { batch_number: batchNumberValue } : {},
  });

  const { data: BatchNumberData } = useFetchQuery("/api/qr_codes", "get", {
    query: productCodeValue !== "" ? { product_code: productCodeValue } : {},
  });

  const { data: selectedPalletsData } = useFetchQuery(
    "/api/qr_codes",
    "get",
    {
      query: {
        product_code: productCodeValue,
        batch_number: batchNumberValue,
      },
    },
    undefined,
    productCodeValue !== "" && batchNumberValue !== "",
  );

  const { width } = useWindowDimensions();

  const [isProductCodeFocus, setIsProductCodeFocus] = useState(true);
  const [isbatchNumberFocus, setIsbatchNumberFocus] = useState(true);
  const [PCfilteredData, setPCFilteredData] = useState<QrCodeItem[]>(
    (ProductCodeData?.member as QrCodeItem[]) ?? [],
  );
  const [BNfilteredData, setBNFilteredData] = useState<QrCodeItem[]>(
    (BatchNumberData?.member as QrCodeItem[]) ?? [],
  );
  useEffect(() => {
    const members = (ProductCodeData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    const deduped = members.filter((line) => {
      const code = line.product_code ?? "";
      if (seen.has(code)) return false;
      seen.add(code);
      return true;
    });
    setPCFilteredData(deduped);
  }, [ProductCodeData]);

  useEffect(() => {
    const members = (BatchNumberData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    setBNFilteredData(
      members.filter((line) => {
        const bn = line.batch_number ?? "";
        if (seen.has(bn)) return false;
        seen.add(bn);
        return true;
      }),
    );
  }, [BatchNumberData]);

  useEffect(() => {
    const members = (ProductCodeData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    const filteredResult = members.filter((line) => {
      const code = line.product_code ?? "";
      if (seen.has(code) || !code.includes(dynamicProductCodeValue))
        return false;
      seen.add(code);
      return true;
    });
    setPCFilteredData(filteredResult);
  }, [dynamicProductCodeValue, ProductCodeData]);

  useEffect(() => {
    const members = (ProductCodeData?.member as QrCodeItem[]) ?? [];
    const seen = new Set<string>();
    const filteredResult = members.filter((line) => {
      const code = line.product_code ?? "";
      if (seen.has(code) || !code.includes(dynamicProductCodeValue))
        return false;
      seen.add(code);
      return true;
    });
    setPCFilteredData(filteredResult);
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
              title={capitalizeFirst(t("view_pallet_sheet.view_pallet_sheet"))}
              className="mb-2"
            />
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
            <View className="mt-5">
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
                        pathname: "/home/modify_pallet_sheet",
                        params: {
                          stockCategory,
                          alreadySetQrId: qr.id,
                        },
                      }}
                      asChild
                    >
                      {qr.id && qr.quantity && (
                        <Pressable>
                          <PalletCard objId={qr.id} objQuantity={qr.quantity} />
                        </Pressable>
                      )}
                    </Link>
                  );
                }}
              />
            </View>
          </>
        }
      />
    </RootView>
  );
}
