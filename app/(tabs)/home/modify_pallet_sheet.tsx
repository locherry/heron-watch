import { useLocalSearchParams } from "expo-router";
import {
  ArrowBigRightDash,
  MessageCircleWarning,
  Pencil,
  Trash,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import QrScannerButton from "~/components/QrScannerButton";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

interface SheetRowProps {
  label: string;
  classNameText?: string;
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
  classNameText = "",
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
          <Text
            className={cn(
              "font-extrabold text-[30px] text-center flex-1",
              classNameText,
            )}
          >
            {value ?? ""}
          </Text>
        )}
      </View>
    </Row>
  );
}

export default function add_pallet_sheet() {
  const [t] = useTranslation();
  const { mutate: modifyQrData } = useFetchMutation(
    "/api/qr_codes/{id}",
    "patch",
  );
  const { mutate: deleteQrData } = useFetchMutation(
    "/api/qr_codes/{id}",
    "delete",
  );

  const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
  const { stockCategory = "PF_G", alreadySetQrId = undefined } = rawParams as {
    stockCategory?: "PF_G" | "PF_M";
    alreadySetQrId?: number | undefined;
  };
  const { height, width } = useWindowDimensions();
  const { rowNameWidth, rowsHeight } = {
    rowNameWidth: Math.round(width / 5),
    rowsHeight: Math.round(height / 12),
  };

  //Variable that stocks user's inputs in pallet sheet

  const [quantityInput, setQuantityInput] = useState<string | undefined>(
    undefined,
  );

  //State depending constants
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [completeData, setCompleteData] = useState<any>([]);
  const [stockData, setStockData] = useState<any>([]);
  const [placedQuantity, setPlacedQuantity] = useState<any>([]);
  const [qrId, setQrId] = useState<undefined | number>(alreadySetQrId);
  const [isQuantityInputInvalid, setIsQuantityInputInvalid] = useState(false);

  let {
    data: palletCompleteData = [],
    isLoading: isNewDataLoading = false,
    error: newDataError,
  } = useFetchQuery(
    "/api/qr_codes/{id}",
    "get",
    {
      path: { id: (qrId ?? 0).toString() },
    },
    undefined,
    qrId ? true : false,
  );

  let {
    data: alreadyPlacedQuantity = null,
    isLoading: isLoadingPlacedQuantity = false,
    error: placedQuantityError = false,
  } = useFetchQuery(
    "/api/qr_codes",
    "get",
    {
      query: {
        stock_category: stockCategory,
        product_code: completeData.product_code,
        batch_number: completeData.batch_number,
      },
    },
    undefined,
    isDataFetched,
  );

  let {
    data: productStockQuantity = null,
    isLoading: productStockIsLoading = false,
    isError: productStockIsError = false,
  } = useFetchQuery(
    "/api/stock/current_stock",
    "get",
    {
      query: {
        stock_category: stockCategory,
        "product.product_code": completeData?.product_code,
        batch_number: completeData?.batch_number,
      } as any,
    },
    undefined,
    isDataFetched,
  );

  const handleModifyData = () => {
    if (isDataFetched && quantityInput) {
      modifyQrData(
        {
          params: { path: { id: (qrId ?? 0).toString() } },
          body: { quantity: Number(quantityInput) },
        },
        {
          onSuccess: () => {
            setQrId(undefined);
            setIsDataFetched(false);
          },
          onError: (error) => {
            console.log(error.message);
          },
        },
      );
      setQuantityInput(undefined);
      setIsDataFetched(false);
      setPlacedQuantity([]);
      setCompleteData([]);
      setStockData([]);
    } else if (!quantityInput) {
      setIsQuantityInputInvalid(true);
    }
  };

  const handleDeleteData = () => {
    if (isDataFetched) {
      deleteQrData(
        {
          params: { path: { id: (qrId ?? 0).toString() } },
        },
        {
          onSuccess: () => {
            console.log("Qr code successfully deleted");
          },
          onError: (error) => {
            console.log(error.message);
          },
        },
      );
      setQuantityInput(undefined);
      setIsDataFetched(false);
      setPlacedQuantity([]);
      setCompleteData([]);
      setStockData([]);
    }
  };

  useEffect(() => {
    if (palletCompleteData && !Array.isArray(palletCompleteData)) {
      setCompleteData(palletCompleteData);
      setIsDataFetched(true);
    }
  }, [
    Array.isArray(palletCompleteData) ? undefined : palletCompleteData?.["@id"],
  ]);

  useEffect(() => {
    if (
      productStockQuantity != null &&
      (productStockQuantity.member?.length ?? 0) > 0
    ) {
      setStockData(productStockQuantity.member![0]);
    }
  }, [productStockQuantity?.totalItems]);

  useEffect(() => {
    if (
      alreadyPlacedQuantity != null &&
      (alreadyPlacedQuantity.member?.length ?? 0) > 0
    ) {
      const total = (
        alreadyPlacedQuantity.member as Array<{ quantity?: number }>
      ).reduce((sum, qr) => sum + (qr.quantity ?? 0), 0);
      setPlacedQuantity(total);
      setQuantityInput(completeData?.quantity?.toString());
    }
  }, [alreadyPlacedQuantity?.totalItems]);

  return (
    <RootView disableInsets={{ left: true }} className="flex gap-y-[30]">
      <Header
        title={capitalizeFirst(
          t("modify_pallet_sheet.modify_existing_pallet_sheet"),
        )}
      ></Header>
      <FlatList
        focusable={false}
        data={[]} // empty, we're just using it for scroll container
        keyExtractor={(_, i) => i.toString()}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Row>
              <Text className="text-2xl font-mono">
                {capitalizeFirst(t("add_pallet_sheet.remains_to_be_placed")) +
                  " : "}
              </Text>
              {!Array.isArray(stockData) ? (
                productStockIsLoading || isNewDataLoading ? (
                  <ActivityIndicator size="small" color="hsl(var(--primary))" />
                ) : (
                  <Text
                    className={cn(
                      "text-xl",
                      stockData?.quantity - placedQuantity >= 0
                        ? "text-foreground"
                        : "text-destructive",
                    )}
                  >
                    {stockData?.quantity - placedQuantity}
                  </Text>
                )
              ) : (
                <Text>
                  {capitalizeFirst(t("add_pallet_sheet.select_a_product"))}
                </Text>
              )}
              {quantityInput !== "" && quantityInput != undefined ? (
                <>
                  <Icon as={ArrowBigRightDash} size={30} />
                  <Text
                    className={cn(
                      "text-xl",
                      stockData?.quantity -
                        placedQuantity -
                        (Number(quantityInput) - placedQuantity) <
                        0
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {stockData?.quantity -
                      placedQuantity -
                      (Number(quantityInput) - placedQuantity)}
                  </Text>
                </>
              ) : (
                <></>
              )}
            </Row>
            {/* PALLET SHEET DETAILS */}
            <View className="border-2 border-[hsl(var(--border))] rounded-xl">
              <SheetRow
                label={t("actions.product_code")}
                editable={false}
                value={completeData?.product_code ?? ""}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                label={t("add_pallet_sheet.origin")}
                editable={false}
                value="ORIGIN"
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                classNameText="text-gray-300"
              />
              <SheetRow
                label={t("add_pallet_sheet.client")}
                editable={false}
                value="CLIENT"
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                classNameText="text-gray-300"
              />
              <SheetRow
                editable={false}
                label={t("add_pallet_sheet.product")}
                value={completeData?.product_name ?? ""}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                editable={false}
                label={t("add_pallet_sheet.batch_number")}
                value={completeData?.batch_number ?? ""}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                editable={false}
                label={t("add_pallet_sheet.expire_at")}
                value={completeData?.expiration_date ?? ""}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                isLoading={isNewDataLoading}
              />
              <SheetRow
                editable={isDataFetched}
                label={t("add_pallet_sheet.quantity")}
                value={quantityInput}
                placeholder={completeData?.quantity}
                onChangeText={(text) => {
                  setQuantityInput(text === "" ? undefined : text);
                }}
                rowNameWidth={rowNameWidth}
                rowsHeight={rowsHeight}
                bordersEnabled={false} // last item so no borders
              />
            </View>
            <View className="items-center mt-4">
              {qrId ? (
                <>
                  <Row className="items-center justify-center" gap={20}>
                    <Button
                      className=""
                      icon={Pencil}
                      onPress={handleModifyData}
                    >
                      {capitalizeFirst(t("common.submit_modifications"))}
                    </Button>
                    <Button icon={Trash} onPress={handleDeleteData}>
                      {capitalizeFirst(
                        t("modify_pallet_sheet.delete_pallet_sheet"),
                      )}
                    </Button>
                  </Row>
                </>
              ) : (
                <QrScannerButton
                  onScan={(data) => {
                    setQrId(Number(data));
                  }}
                >
                  {capitalizeFirst(
                    t("modify_pallet_sheet.scan_existing_sheet"),
                  )}
                </QrScannerButton>
              )}
            </View>
            {isQuantityInputInvalid ? (
              <Alert
                icon={MessageCircleWarning}
                className="text-destructive my-4"
              ></Alert>
            ) : null}
          </>
        }
      />
    </RootView>
  );
}
