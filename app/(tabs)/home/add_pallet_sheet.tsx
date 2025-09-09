import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { QrCodeIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { CreatePalletSheet } from "~/components/create-pallet-sheet";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
  isLoading = false,
}: SheetRowProps) {
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
            className="font-extrabold text-[30px] text-center flex-1"
            placeholder={placeholder}
            value={value?.toString()}
            onChangeText={onChangeText}
            style={[
              { fontSize: 30, lineHeight: 36, paddingVertical: 0 }, // <- ensure text matches Text component
            ]}
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

export default function add_pallet_sheet() {
  const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";
  };
  const { height, width } = useWindowDimensions();
  const { rowNameWidth, rowsHeight } = {
    rowNameWidth: Math.round(width / 5),
    rowsHeight: Math.round(height / 12),
  };

  //Variable that stocks user selected value on droplists
  const [product_code_value, setProductCodeValue] = useState("");
  const [lot_number_value, setLotNumberValue] = useState("");

  let [newQRData, setNewQRData] = useState<number | undefined>(undefined);

  //Variable that stocks user's inputs in pallet sheet
  const [originInput, setOriginInput] = useState<string | undefined>(undefined);
  const [clientInput, setClientInput] = useState<string | undefined>(undefined);
  const [quantityInput, setQuantityInput] = useState<string | undefined>(
    undefined
  );

  //variable that allowed other droplists to be used
  let { data, error, isLoading, isError } = useFetchQuery(
    "/stocks/{stock_category}",
    "get",
    {
      path: { stock_category: stockCategory },
      query:
        product_code_value === "" && lot_number_value === ""
          ? { distinct: true, required_elts: ["product_code"] }
          : product_code_value !== "" && lot_number_value === ""
            ? {
                distinct: true,
                required_elts: ["lot_number"],
                filter_params: { product_code: product_code_value },
              }
            : {
                distinct: true,
                filter_params: {
                  product_code: product_code_value!,
                  lot_number: lot_number_value!,
                },
              },
    }
  );

  //State depending constants
  const [filteredData, setFilteredData] = useState(data?.data ?? []);
  const [dynamic_product_code_value, setDynamicProductCodeValue] = useState("");
  const [dynamic_lot_number_value, setDynamicLotNumberValue] = useState("");
  const [isProductCodeSelected, setIsProductCodeSelected] = useState(false);
  const [isLotNumberSelected, setIsLotNumberSelected] = useState(false);
  const [isProductCodeFocus, setIsProductCodeFocus] = useState(true);
  const [isLotNumberFocus, setIsLotNumberFocus] = useState(true);
  const [completeData, setCompleteData] = useState<any>([]);

  let {
    data: productCompleteData = [],
    isLoading: isNewDataLoading = false,
    error: newDataError,
  } = useFetchQuery(
    "/stocks_join_product_category/{stock_category}",
    "get",
    {
      path: { stock_category: stockCategory },
      query: {
        filter_params: {
          product_code: product_code_value,
          lot_number: lot_number_value,
        },
      },
    },
    undefined,
    isProductCodeSelected && isLotNumberSelected
  );

  let {data : alreadyPlacedQuantity = null, isLoading : isLoadingPlacedQuantity = false, error : placedQuantityError = false} = useFetchQuery(
    "/qr-code/{stock_category}/{product_code}/{lot_number}",
    'get',
    {
      path : {stock_category : stockCategory, product_code : product_code_value, lot_number : lot_number_value}
    },
    undefined,
    isProductCodeSelected && isLotNumberSelected
  )

  useEffect(() => {
    if (!isProductCodeSelected && !isLotNumberSelected) {
      if (data !== undefined && data.data !== undefined) {
        let filteredResult = data?.data?.filter((line) =>
          line.product_code.includes(dynamic_product_code_value)
        );
        setFilteredData(filteredResult);
      }
    }
  }, [dynamic_product_code_value]);

  useEffect(() => {
    if (!isLotNumberSelected && isProductCodeSelected) {
      if (data !== undefined && data.data !== undefined) {
        let filteredResult = data?.data?.filter((line) =>
          line.lot_number.includes(dynamic_lot_number_value)
        );
        setFilteredData(filteredResult);
      }
    }
  }, [dynamic_lot_number_value]);

  useEffect(() => {
    if (productCompleteData && !Array.isArray(productCompleteData)) {
      setCompleteData(productCompleteData?.data?.[0]);
    } else if (
      !Array.isArray(completeData) &&
      (!isLotNumberSelected || !isProductCodeSelected)
    ) {
      setCompleteData([]);
    }
  }, [productCompleteData]);

  useEffect(() => {
    setFilteredData(data?.data ?? []);
  }, [data]);

  let isSelectingPC = false;
  let isSelectingLN = false;
  console.log(isNewDataLoading);
  return (
    <RootView disableInsets={{ left: true, top: true }}>
      <FlatList
        focusable={false}
        data={[]} // empty, we're just using it for scroll container
        keyExtractor={(_, i) => i.toString()}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Text variant="h2" className="mb-2">
              <Row className="w-full justify-between">
                <Text className="text-4xl">
                  {capitalizeFirst(t("add_pallet_sheet.add_pallet_sheet"))}
                </Text>
                <Label className="text-2xl font-mono">
                  {capitalizeFirst(t("add_pallet_sheet.remains_to_be_placed")) +
                    " : "}
                    {!Array.isArray(completeData)
                      ? isLoadingPlacedQuantity || isNewDataLoading ? (
                        <ActivityIndicator size="small" color="hsl(var(--primary))"  />
                      ) : (
                        <Text>
                          {completeData?.quantity - (alreadyPlacedQuantity?.data?.quantity ?? 0)}
                        </Text>)
                      : (
                        <Text> 
                          {capitalizeFirst(t("add_pallet_sheet.select_a_product"))}
                        </Text>
                        )
                      }
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <QrCodeIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text>
                      {capitalizeFirst(
                        t("add_pallet_sheet.modify_existing_pallet_sheet")
                      )}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              </Row>
            </Text>

            {/* PRODUCT CODE AUTOCOMPLETE */}
            <Row className="w-full justify-between mb-2 z-20">
              <Label className="text-base">
                {capitalizeFirst(t("actions.product_code"))}
              </Label>
              <Autocomplete
                inputContainerStyle={{ borderWidth: 0 }} // remove default border
                containerStyle={{ width: width / 5 }}
                hideResults={isProductCodeFocus}
                onBlur={() => {
                  setTimeout(() => {
                    Keyboard.dismiss();
                    if (!isProductCodeFocus && !isSelectingPC) {
                      setIsProductCodeFocus(true);
                    } else {
                      isSelectingPC = false;
                    }
                  }, 100);
                }}
                onFocus={() => {
                  setIsProductCodeFocus(false);
                }}
                data={!isProductCodeFocus ? filteredData : []}
                value={dynamic_product_code_value}
                onChangeText={(text) => {
                  if (product_code_value !== "") {
                    if (lot_number_value !== "") {
                      setLotNumberValue("");
                      setIsLotNumberSelected(false);
                    }
                    setProductCodeValue("");
                    setDynamicLotNumberValue("");
                  }
                  setDynamicProductCodeValue(text);
                  setIsProductCodeSelected(false);
                }}
                renderTextInput={(props) => (
                  <Input {...props} placeholder={t("actions.product_code")} />
                )}
                flatListProps={{
                  keyExtractor: (item) => item.product_code,
                  renderItem: ({ item }) => (
                    <TouchableOpacity
                      className="flex-row justify-center border border-black dark:border-white bg-white dark:bg-black"
                      onPressIn={() => (isSelectingPC = true)}
                      onPress={() => {
                        setProductCodeValue(item.product_code);
                        setIsProductCodeSelected(true);
                        setDynamicProductCodeValue(item.product_code);
                        setIsProductCodeFocus(true);
                      }}
                    >
                      <Text className="text-black dark:text-white">
                        {item.product_code}
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </Row>

            {/* LOT NUMBER AUTOCOMPLETE */}
            <Row className="w-full justify-between mb-2 z-10">
              <Label className="text-base">
                {capitalizeFirst(t("actions.lot_number"))}
              </Label>
              <Autocomplete
                inputContainerStyle={{ borderWidth: 0 }} // remove default border
                containerStyle={{ width: width / 5 }}
                hideResults={isLotNumberFocus}
                onBlur={() => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    if (!isLotNumberFocus && !isSelectingLN) {
                      setIsLotNumberFocus(true);
                    } else {
                      isSelectingLN = false;
                    }
                  }, 100);
                }}
                renderTextInput={(props) => (
                  <Input {...props} placeholder={t("actions.lot_number")} />
                )}
                onFocus={() => {
                  if (isLotNumberFocus) {
                    setIsLotNumberFocus(false);
                  }
                }}
                editable={isProductCodeSelected}
                data={!isLotNumberFocus ? filteredData : []}
                value={dynamic_lot_number_value}
                onChangeText={(text) => {
                  if (lot_number_value !== "") {
                    setLotNumberValue("");
                    setIsLotNumberSelected(false);
                  }
                  setDynamicLotNumberValue(text);
                }}
                flatListProps={{
                  keyExtractor: (item) => item.lot_number,
                  renderItem: ({ item }) => (
                    <TouchableOpacity
                      className="flex-row justify-center border border-black dark:border-white bg-white dark:bg-black"
                      onPressIn={() => (isSelectingLN = true)}
                      onPress={() => {
                        setLotNumberValue(item.lot_number);
                        setIsLotNumberSelected(true);
                        setDynamicLotNumberValue(item.lot_number);
                        setIsLotNumberFocus(true);
                      }}
                    >
                      <Text className="text-black dark:text-white">
                        {item.lot_number}
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </Row>

            {/* PALLET SHEET DETAILS */}
            <View className="border-2 border-[hsl(var(--border))] rounded-xl">
              <SheetRow
                label={t("actions.product_code")}
                value={completeData?.product_code}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                label={t("add_pallet_sheet.origin")}
                editable={isLotNumberSelected}
                placeholder="Origin (Ex : IGP)"
                value={originInput}
                onChangeText={(text) =>
                  setOriginInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
              />
              <SheetRow
                label={t("add_pallet_sheet.client")}
                editable={isLotNumberSelected}
                placeholder="Client (Ex : AGRO)"
                value={clientInput}
                onChangeText={(text) =>
                  setClientInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
              />
              <SheetRow
                label={t("add_pallet_sheet.product")}
                value={completeData?.product_name}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                label={t("add_pallet_sheet.lot_number")}
                value={completeData?.lot_number}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                label={t("add_pallet_sheet.expiration_date")}
                value={completeData?.expiration_date}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                label={t("add_pallet_sheet.quantity")}
                editable={isLotNumberSelected}
                placeholder="Ex : 40"
                value={quantityInput?.toString()}
                onChangeText={(text) =>
                  setQuantityInput(text === "" ? undefined : text)
                }
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                bordersEnabled={false} // last item so no borders
              />
            </View>

            <CreatePalletSheet
              className="mt-3"
              stockCategory={stockCategory}
              data={
                !Array.isArray(completeData)
                  ? {
                      ...completeData,
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
