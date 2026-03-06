import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PalletCard } from "~/components/ui/pallet-card";
import { Text } from "~/components/ui/text";
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
  const [batchNumberValue, setbatchNumberValue] = useState("");
  const [dynamicProductCodeValue, setDynamicProductCodeValue] = useState("");
  const [dynamicBatchNumberValue, setDynamicbatchNumberValue] = useState("");

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
              <Autocomplete
                inputContainerStyle={{ borderWidth: 0 }}
                containerStyle={{ width: width / 5 }}
                hideResults={isProductCodeFocus}
                onBlur={() => {
                  setTimeout(() => {
                    Keyboard.dismiss();
                    if (!isProductCodeFocus && !isSelectingPC.current) {
                      setIsProductCodeFocus(true);
                    } else {
                      isSelectingPC.current = false;
                    }
                  }, 100);
                }}
                onFocus={() => setIsProductCodeFocus(false)}
                data={!isProductCodeFocus ? PCfilteredData : []}
                value={dynamicProductCodeValue}
                onChangeText={(text) => {
                  if (productCodeValue !== "") setProductCodeValue("");
                  setDynamicProductCodeValue(text ?? "");
                }}
                renderTextInput={(props) => (
                  <Input {...props} placeholder={t("actions.product_code")} />
                )}
                flatListProps={{
                  keyExtractor: (_item: unknown, index: number) =>
                    `pc-${index}`,
                  renderItem: ({ item }: { item: unknown }) => {
                    const qr = item as QrCodeItem;
                    return (
                      <TouchableOpacity
                        className="flex-row justify-center border bg-background border-muted-foreground hover:bg-muted rounded-md"
                        onPressIn={() => (isSelectingPC.current = true)}
                        onPress={() => {
                          setProductCodeValue(qr.product_code ?? "");
                          setDynamicProductCodeValue(qr.product_code ?? "");
                          setIsProductCodeFocus(true);
                        }}
                      >
                        <Text>{qr.product_code}</Text>
                      </TouchableOpacity>
                    );
                  },
                }}
              />
            </View>
            <View className="z-10">
              <Label className="text-base">
                {capitalizeFirst(t("actions.batch_number"))}
              </Label>
              <Autocomplete
                inputContainerStyle={{ borderWidth: 0 }}
                containerStyle={{ width: width / 5 }}
                hideResults={isbatchNumberFocus}
                onBlur={() => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    if (!isbatchNumberFocus && !isSelectingLN.current) {
                      setIsbatchNumberFocus(true);
                    } else {
                      isSelectingLN.current = false;
                    }
                  }, 100);
                }}
                renderTextInput={(props) => (
                  <Input {...props} placeholder={t("actions.batch_number")} />
                )}
                onFocus={() => setIsbatchNumberFocus(false)}
                data={!isbatchNumberFocus ? BNfilteredData : []}
                value={dynamicBatchNumberValue}
                onChangeText={(text) => {
                  if (batchNumberValue !== "") setbatchNumberValue("");
                  setDynamicbatchNumberValue(text);
                }}
                flatListProps={{
                  keyExtractor: (_item: unknown, index: number) =>
                    `bn-${index}`,
                  renderItem: ({ item }: { item: unknown }) => {
                    const qr = item as QrCodeItem;
                    return (
                      <TouchableOpacity
                        className="flex-row justify-center border bg-background border-muted-foreground hover:bg-muted"
                        onPressIn={() => (isSelectingLN.current = true)}
                        onPress={() => {
                          setbatchNumberValue(qr.batch_number ?? "");
                          setDynamicbatchNumberValue(qr.batch_number ?? "");
                          setIsbatchNumberFocus(true);
                        }}
                      >
                        <Text>{qr.batch_number}</Text>
                      </TouchableOpacity>
                    );
                  },
                }}
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
