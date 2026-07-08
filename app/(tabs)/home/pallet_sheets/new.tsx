import { useLocalSearchParams } from "expo-router";
import { ArrowBigRightDash } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from "react-native";
import { StockRead } from "~/@types/stock";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import { CreatePalletSheet } from "~/components/CreatePalletSheet";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

interface SheetRowProps {
  label: string;
  value?: string | number;
  editable?: boolean;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  rowNameWidth: number;
  rowsHeight: number;
  bordersEnabled?: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

function SheetRow({
  label,
  value,
  editable = false,
  placeholder,
  onChangeText,
  rowNameWidth,
  rowsHeight,
  bordersEnabled = true,
  isError = false,
  isLoading = false,
}: SheetRowProps) {
  const [t] = useTranslation();

  return (
    <Row
      className={cn(bordersEnabled && "border-b-2 border-[hsl(var(--border))]")}
    >
      <Text
        className="p-2 border-r-[2px] border-[hsl(var(--border))] text-center text-[30px] flex justify-center items-center"
        style={{ width: rowNameWidth }}
      >
        {label.toUpperCase()}
      </Text>
      <View className="flex-1 p-2">
        {editable ? (
          <Input
            className={cn(
              "font-extrabold text-[30px] text-center flex-1",
              isError && "border-destructive",
            )}
            placeholder={placeholder}
            value={value?.toString()}
            onChangeText={onChangeText}
            style={[{ fontSize: 30, lineHeight: 36, paddingVertical: 0 }]}
          />
        ) : isLoading ? (
          <ActivityIndicator size="small" color="hsl(var(--primary))" />
        ) : (
          <Text className="font-extrabold text-[30px] text-center flex-1">
            {value ?? ""}
          </Text>
        )}
      </View>
    </Row>
  );
}

export default function NewPalletSheet() {
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";
  };
  const { height, width } = useWindowDimensions();
  const { rowNameWidth, rowsHeight } = {
    rowNameWidth: Math.round(width / 5),
    rowsHeight: Math.round(height / 12),
  };

  const [product_code_value, setProductCodeValue] = useState("");
  const [batch_number_value, setbatchNumberValue] = useState("");

  const [originInput, setOriginInput] = useState<string | undefined>(undefined);
  const [clientInput, setClientInput] = useState<string | undefined>(undefined);
  const [quantityInput, setQuantityInput] = useState<string | undefined>(
    undefined,
  );

  let { data, error, isLoading, isError } = useFetchQuery(
    "/api/stock/current_stock",
    "get",
    {
      query: {
        stock_category: stockCategory,
      },
    },
  );

  const [filteredData, setFilteredData] = useState<StockRead[]>(
    data?.member ?? [],
  );
  const [dynamic_product_code_value, setDynamicProductCodeValue] = useState("");
  const [dynamic_batch_number_value, setDynamicbatchNumberValue] = useState("");
  const [isProductCodeSelected, setIsProductCodeSelected] = useState(false);
  const [isbatchNumberSelected, setIsbatchNumberSelected] = useState(false);
  const [isProductCodeFocus, setIsProductCodeFocus] = useState(true);
  const [isbatchNumberFocus, setIsbatchNumberFocus] = useState(true);
  const [completeData, setCompleteData] = useState<StockRead | null>(null);
  const [placedQuantity, setPlacedQuantity] = useState<number>(0);
  const [isQuantityError, setIsQuantityError] = useState<boolean>(false);

  let {
    data: alreadyPlacedQuantity,
    isLoading: isLoadingPlacedQuantity = false,
    error: placedQuantityError,
  } = useFetchQuery(
    "/api/qr_codes",
    "get",
    {
      query: {
        stock_category: stockCategory,
        product_code: product_code_value,
        batch_number: batch_number_value,
      },
    },
    undefined,
    isProductCodeSelected && isbatchNumberSelected,
  );

  useEffect(() => {
    if (!isProductCodeSelected && !isbatchNumberSelected) {
      if (data?.member !== undefined) {
        const seen = new Set<string>();
        const filteredResult = (data.member as StockRead[]).filter((line) => {
          const code = line.product?.product_code ?? "";
          if (seen.has(code) || !code.includes(dynamic_product_code_value))
            return false;
          seen.add(code);
          return true;
        });
        setFilteredData(filteredResult);
      }
    }
  }, [dynamic_product_code_value]);

  useEffect(() => {
    if (!isbatchNumberSelected && isProductCodeSelected) {
      if (data?.member !== undefined) {
        const filteredResult = (data.member as StockRead[]).filter(
          (line) =>
            line.product?.product_code === product_code_value &&
            line.batch_number?.includes(dynamic_batch_number_value),
        );
        setFilteredData(filteredResult);
      }
    }
  }, [dynamic_batch_number_value, product_code_value, isProductCodeSelected]);

  useEffect(() => {
    if (isProductCodeSelected && isbatchNumberSelected && data?.member) {
      const found = (data.member as StockRead[]).find(
        (line) =>
          line.product?.product_code === product_code_value &&
          line.batch_number === batch_number_value,
      );
      setCompleteData(found ?? null);
    } else {
      setCompleteData(null);
    }
  }, [
    isProductCodeSelected,
    isbatchNumberSelected,
    product_code_value,
    batch_number_value,
    data,
  ]);

  useEffect(() => {
    if (alreadyPlacedQuantity && alreadyPlacedQuantity.member?.length > 0) {
      const total = (
        alreadyPlacedQuantity.member as Array<{ quantity?: number }>
      ).reduce((sum, qr) => sum + (qr.quantity ?? 0), 0);
      setPlacedQuantity(total);
    } else {
      setPlacedQuantity(0);
    }
  }, [alreadyPlacedQuantity]);

  useEffect(() => {
    setFilteredData((data?.member as StockRead[]) ?? []);
  }, [data]);

  useEffect(() => {
    if (completeData) {
      if ((completeData.quantity ?? 0) - (Number(quantityInput) ?? 0) < 0) {
        setIsQuantityError(true);
      } else {
        setIsQuantityError(false);
      }
    }
  }, [quantityInput]);

  const isSelectingProductCode = useRef(false);
  const isSelectingBatchNumber = useRef(false);

  const handleProductCodeSelect = useCallback(
    (stock: StockRead) => {
      const code = stock.product?.product_code ?? "";
      setProductCodeValue(code);
      setIsProductCodeSelected(true);
      setDynamicProductCodeValue(code);
      setIsProductCodeFocus(true);
      setFilteredData(
        ((data?.member as StockRead[]) ?? []).filter(
          (line) => line.product?.product_code === code,
        ),
      );
    },
    [data],
  );

  const handleBatchNumberSelect = useCallback(
    (stock: StockRead) => {
      const batch = stock.batch_number ?? "";
      setbatchNumberValue(batch);
      setIsbatchNumberSelected(true);
      setDynamicbatchNumberValue(batch);
      setIsbatchNumberFocus(true);
      setFilteredData(
        ((data?.member as StockRead[]) ?? []).filter(
          (line) => line.batch_number === batch,
        ),
      );
    },
    [data],
  );

  return (
    <RootView disableInsets={{ left: true }}>
      <Header
        title={capitalizeFirst(t("addPalletSheet.addPalletSheet"))}
      ></Header>
      <FlatList
        focusable={false}
        data={[]}
        keyExtractor={(_, i) => i.toString()}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Text variant="h2" className="mb-2">
              <Row className="w-full justify-start" gap={10}>
                <Text className="text-2xl font-mono">
                  {capitalizeFirst(t("addPalletSheet.remainsToBePlaced")) +
                    " : "}
                </Text>
                {completeData !== null ? (
                  isLoadingPlacedQuantity || isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="hsl(var(--primary))"
                    />
                  ) : (
                    <Text
                      className={cn(
                        "text-xl",
                        (completeData.quantity ?? 0) - placedQuantity >= 0
                          ? "text-foreground"
                          : "text-destructive",
                      )}
                    >
                      {(completeData.quantity ?? 0) - placedQuantity}
                    </Text>
                  )
                ) : (
                  <Text>
                    {capitalizeFirst(t("addPalletSheet.selectAProduct"))}
                  </Text>
                )}
                {quantityInput !== "" && quantityInput != undefined ? (
                  <>
                    <Icon as={ArrowBigRightDash} size={30} />
                    <Text
                      className={cn(
                        "text-xl",
                        (completeData?.quantity ?? 0) -
                          placedQuantity -
                          (Number(quantityInput) ?? 0) <
                          0
                          ? "text-destructive"
                          : "text-foreground",
                      )}
                    >
                      {(completeData?.quantity ?? 0) -
                        placedQuantity -
                        (Number(quantityInput) ?? 0)}
                    </Text>
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </Text>

            {/* PRODUCT CODE AUTOCOMPLETE */}
            <Row className="w-full justify-between mb-2 z-20">
              <Label className="text-base">
                {capitalizeFirst(t("actions.productCode"))}
              </Label>
              <AutocompleteInput
                data={filteredData.map((s) => ({
                  label: s.product?.product_code ?? "",
                  value: s.product?.product_code ?? "",
                }))}
                value={dynamic_product_code_value}
                onChangeText={(text) => {
                  if (product_code_value !== "") {
                    if (batch_number_value !== "") {
                      setbatchNumberValue("");
                      setIsbatchNumberSelected(false);
                    }
                    setProductCodeValue("");
                    setDynamicbatchNumberValue("");
                  }
                  setDynamicProductCodeValue(text ?? "");
                  setIsProductCodeSelected(false);
                }}
                onSelect={(item) =>
                  handleProductCodeSelect(
                    filteredData.find(
                      (s) => s.product?.product_code === item.value,
                    )!,
                  )
                }
                placeholder={t("actions.productCode")}
              />
            </Row>

            {/* Batch NUMBER AUTOCOMPLETE */}
            <Row className="w-full justify-between mb-2 z-10">
              <Label className="text-base">
                {capitalizeFirst(t("actions.batchNumber"))}
              </Label>
              <AutocompleteInput
                data={filteredData.map((s) => ({
                  label: s.batch_number ?? "",
                  value: s.batch_number ?? "",
                }))}
                value={dynamic_batch_number_value}
                onChangeText={(text) => {
                  if (batch_number_value !== "") {
                    setbatchNumberValue("");
                    setIsbatchNumberSelected(false);
                  }
                  setDynamicbatchNumberValue(text);
                }}
                onSelect={(item) =>
                  handleBatchNumberSelect(
                    filteredData.find((s) => s.batch_number === item.value)!,
                  )
                }
                placeholder={t("actions.batchNumber")}
              />
            </Row>

            {/* PALLET SHEET DETAILS */}
            <View className="border-2 border-[hsl(var(--border))] rounded-xl">
              <SheetRow
                label={t("actions.productCode")}
                value={completeData?.product?.product_code}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isLoading}
              />
              <SheetRow
                label={t("addPalletSheet.origin")}
                editable={isbatchNumberSelected}
                placeholder="Origin (Ex : IGP)"
                value={originInput}
                onChangeText={(text) =>
                  setOriginInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
              />
              <SheetRow
                label={t("addPalletSheet.client")}
                editable={isbatchNumberSelected}
                placeholder="Client (Ex : AGRO)"
                value={clientInput}
                onChangeText={(text) =>
                  setClientInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
              />
              <SheetRow
                label={t("addPalletSheet.product")}
                value={completeData?.product?.product_name}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isLoading}
              />
              <SheetRow
                label={t("addPalletSheet.batchNumber")}
                value={completeData?.batch_number}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isLoading}
              />
              <SheetRow
                label={t("addPalletSheet.expireAt")}
                value={completeData?.expire_at}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isLoading}
              />
              <SheetRow
                label={t("addPalletSheet.quantity")}
                editable={isbatchNumberSelected}
                placeholder="Ex : 40"
                value={quantityInput?.toString()}
                onChangeText={(text) =>
                  setQuantityInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isError={isQuantityError}
                bordersEnabled={false}
              />
            </View>

            <CreatePalletSheet
              className="mt-3"
              stockCategory={stockCategory}
              data={
                completeData !== null
                  ? {
                      product_code: completeData.product?.product_code ?? "",
                      batch_number: completeData.batch_number ?? "",
                      product_name: completeData.product?.product_name ?? "",
                      expire_at: completeData.expire_at ?? "",
                      quantity: quantityInput
                        ? Number(quantityInput)
                        : undefined,
                      client: clientInput,
                      origin: originInput,
                    }
                  : undefined
              }
            />
          </>
        }
      />
    </RootView>
  );
}
