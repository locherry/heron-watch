import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    useWindowDimensions,
    View
} from "react-native";
import { Pencil } from "~/assets/images/icons/Pencil";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { H2 } from "~/components/ui/typography";
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
    stockCategory?: "PF_G" | "PF_M";
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
  console.log(alreadyPlacedQuantity);
  return (
    <RootView disableInsets={{ left: true, top: true }} className="flex gap-y-[30]">
      <FlatList
        focusable={false}
        data={[]} // empty, we're just using it for scroll container
        keyExtractor={(_, i) => i.toString()}
        renderItem={null}
        ListHeaderComponent={
          <>
            <H2 className="mb-2">
              <Row className="w-full justify-between">
                <Text className="text-4xl">
                  {capitalizeFirst(t("modify_pallet_sheet.modify_existing_pallet_sheet"))}
                </Text>
              </Row>
            </H2>
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
            <View className="items-center mt-4">
                <Button className="" icon={Pencil}>
                    {capitalizeFirst(t("common.submit_modifications"))}
                </Button>
            </View>
          </>
        }
      />
    </RootView>
  );
}
