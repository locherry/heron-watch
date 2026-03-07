import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { StockRead } from "~/@types/stock";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import QrScannerButton from "~/components/QrScannerButton";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { useDraftActionsStore } from "~/lib/stores/useDraftActionsStore";
import { capitalizeFirst } from "~/lib/utils";

export default function NewAction() {
  const [t] = useTranslation();
  const { addAction, editAction, actions, stockCategory } =
    useDraftActionsStore();
  const { editActionId } = useLocalSearchParams<{ editActionId?: string }>();

  const actionToEdit = editActionId
    ? actions.find((a) => a.id === Number(editActionId))
    : undefined;

  const [actionCategoryId, setActionCategoryId] = React.useState<string>(
    actionToEdit?.action_category?.toString() ??
      String(constants.actionTypes[0].value),
  );

  // Stock data for autocomplete
  const { data: stockData } = useFetchQuery("/api/stock/current_stock", "get", {
    query: { stock_category: stockCategory },
  });
  const stockMembers = (stockData?.member as StockRead[]) ?? [];

  // Filtered autocomplete data
  const [filteredProductCodes, setFilteredProductCodes] = React.useState<
    StockRead[]
  >([]);
  const [filteredBatchNumbers, setFilteredBatchNumbers] = React.useState<
    StockRead[]
  >([]);

  React.useEffect(() => {
    if (stockMembers.length > 0) {
      const seen = new Set<string>();
      setFilteredProductCodes(
        stockMembers.filter((s) => {
          const code = s.product?.product_code ?? "";
          if (seen.has(code)) return false;
          seen.add(code);
          return true;
        }),
      );
    }
  }, [stockData]);

  const OTHER_INPUT_FIELDS = [
    {
      label: capitalizeFirst(t("actions.quantity")),
      key: "quantity" as const,
      regex: /^\d+$/,
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidQuantity")),
    },
    {
      label: capitalizeFirst(t("actions.expireAt")),
      key: "expire_at" as const,
      validate: (value: string) => !isNaN(new Date(value).getTime()),
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidExpirationDate")),
    },
    {
      label: capitalizeFirst(t("actions.transaction")),
      key: "transaction_code" as const,
      regex: /^.*$/,
      required: false,
      errorMessage: "",
    },
    {
      label: capitalizeFirst(t("actions.comment")),
      key: "comment" as const,
      regex: /^.*$/,
      required: false,
      errorMessage: "",
    },
  ] as const;

  const [formData, setFormData] = React.useState<Record<string, string>>({
    product_code: actionToEdit?.product_code ?? "",
    batch_number: actionToEdit?.batch_number ?? "",
    quantity: actionToEdit?.quantity?.toString() ?? "",
    expire_at: actionToEdit?.expire_at ?? "",
    transaction_code: actionToEdit?.transaction_code ?? "",
    comment: actionToEdit?.comment ?? "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (key: string, value: string) => {
    const allFields = [
      {
        key: "product_code",
        regex: /^\d{3}.*$/,
        required: true,
        errorMessage: capitalizeFirst(t("errors.invalidProductCode")),
      },
      {
        key: "batch_number",
        regex: /^[A-Z]{3}\d{6}$/,
        required: true,
        errorMessage: capitalizeFirst(t("errors.invalidbatchNumber")),
      },
      ...OTHER_INPUT_FIELDS,
    ];
    const field = allFields.find((f) => f.key === key);
    if (!field) return "";
    if (field.required && !value) return t("errors.required");
    if (value) {
      if ("validate" in field && !field.validate(value)) {
        console.error("Validation failed for", key, value);
        return field.errorMessage;
      }
      if ("regex" in field && !field.regex.test(value))
        return field.errorMessage;
    }
    return "";
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const isFormValid = [
    "product_code",
    "batch_number",
    ...OTHER_INPUT_FIELDS.map((f) => f.key),
  ].every((key) => !validateField(key, formData[key] ?? ""));

  const handleProductCodeSelect = (item: { label: string; value: string }) => {
    handleChange("product_code", item.value);
    // Reset batch number and filter batches for selected product
    handleChange("batch_number", "");
    const batches = stockMembers.filter(
      (s) => s.product?.product_code === item.value,
    );
    setFilteredBatchNumbers(batches);
  };

  const handleBatchNumberSelect = (item: { label: string; value: string }) => {
    handleChange("batch_number", item.value);
    // Prefill expire_at from stock data
    const stock = stockMembers.find(
      (s) =>
        s.product?.product_code === formData.product_code &&
        s.batch_number === item.value,
    );
    if (stock?.expire_at) {
      handleChange("expire_at", stock.expire_at);
    }
  };

  const handleProductCodeChange = (text: string) => {
    handleChange("product_code", text);
    handleChange("batch_number", "");
    const seen = new Set<string>();
    setFilteredProductCodes(
      stockMembers.filter((s) => {
        const code = s.product?.product_code ?? "";
        if (seen.has(code) || !code.includes(text)) return false;
        seen.add(code);
        return true;
      }),
    );
    setFilteredBatchNumbers([]);
  };

  const handleBatchNumberChange = (text: string) => {
    handleChange("batch_number", text);
    setFilteredBatchNumbers(
      stockMembers.filter(
        (s) =>
          s.product?.product_code === formData.product_code &&
          (s.batch_number ?? "").includes(text),
      ),
    );
  };

  const handleSave = () => {
    const draft = {
      product_code: formData.product_code ?? "",
      batch_number: formData.batch_number ?? "",
      quantity: Number(formData.quantity),
      expire_at: new Date(formData.expire_at ?? "").toISOString(),
      action_category: Number(actionCategoryId),
      transaction_code: formData.transaction_code || undefined,
      comment: formData.comment || undefined,
    };

    if (actionToEdit) {
      editAction(actionToEdit.id, draft);
    } else {
      addAction(draft);
    }

    router.back();
  };

  // QR Code
  const [qrCodeId, setQrCodeId] = React.useState<number | null>(null);

  const onScan = (data: string) => {
    const int = parseInt(data);
    if (isNaN(int)) {
      Toast.show({
        type: "error",
        text1: "Invalid data",
        text2: data + " is not a number.",
      });
    } else {
      setQrCodeId(int);
    }
  };

  const qrCodeResults = useFetchQuery(
    "/api/qr_codes/{id}",
    "get",
    { path: { id: (qrCodeId ?? 0).toString() } },
    undefined,
    !!qrCodeId,
  );

  React.useEffect(() => {
    if (qrCodeResults.data) {
      const qrData = qrCodeResults.data;
      Toast.show({ type: "success", text1: t("QR Code loaded") });
      setFormData((prev) => ({
        ...prev,
        product_code: qrData?.product_code ?? prev.product_code,
        quantity: qrData?.quantity?.toString() ?? prev.quantity ?? "",
        expire_at: qrData?.expire_at ?? prev.expire_at ?? "",
      }));
    }
  }, [qrCodeResults.data]);

  const selectedOption = constants.actionTypes.find(
    (o) => String(o.value) === actionCategoryId,
  );

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <Header
          title={capitalizeFirst(t("actions.newAction"))}
          className="justify-between"
        >
          <Icon as={constants.stockCategoryIcon[stockCategory]} />
        </Header>

        <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
        <Row gap={8} className="mb-4">
          <Select
            className="flex-1"
            defaultValue={constants.actionTypes[0]}
            value={selectedOption}
            onValueChange={(option) =>
              setActionCategoryId(String(option?.value ?? ""))
            }
          >
            <SelectTrigger className="w-full">
              <Row gap={8}>
                {selectedOption?.icon && <Icon as={selectedOption.icon} />}
                <Text>
                  {selectedOption && capitalizeFirst(t(selectedOption.label))}
                </Text>
              </Row>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {capitalizeFirst(t("common.add"))} (+)
                </SelectLabel>
                {constants.actionTypes
                  .filter((a) => a.additionRule === "+")
                  .map((action) => (
                    <SelectItem
                      key={action.value}
                      value={String(action.value)}
                      label={capitalizeFirst(t(action.label))}
                    >
                      <Icon as={action.icon} />
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>
                  {capitalizeFirst(t("common.substract"))} (-)
                </SelectLabel>
                {constants.actionTypes
                  .filter((a) => a.additionRule === "-")
                  .map((action) => (
                    <SelectItem
                      key={action.value}
                      value={String(action.value)}
                      label={capitalizeFirst(t(action.label))}
                    >
                      <Icon as={action.icon} />
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <QrScannerButton onScan={onScan} />
        </Row>

        {/* Product code autocomplete */}
        <View className="mb-2 z-20">
          <Label>{capitalizeFirst(t("actions.product_code"))}</Label>
          <AutocompleteInput
            data={filteredProductCodes.map((s) => ({
              label: s.product?.product_code ?? "",
              value: s.product?.product_code ?? "",
            }))}
            value={formData.product_code ?? ""}
            onChangeText={handleProductCodeChange}
            onSelect={handleProductCodeSelect}
            placeholder={t("actions.product_code")}
          />
          {errors.product_code ? (
            <Text className="text-destructive text-xs mt-1">
              {errors.product_code}
            </Text>
          ) : null}
        </View>

        {/* Batch number autocomplete */}
        <View className="mb-2 z-10">
          <Label>{capitalizeFirst(t("actions.batch_number"))}</Label>
          <AutocompleteInput
            data={filteredBatchNumbers.map((s) => ({
              label: s.batch_number ?? "",
              value: s.batch_number ?? "",
            }))}
            value={formData.batch_number ?? ""}
            onChangeText={handleBatchNumberChange}
            onSelect={handleBatchNumberSelect}
            placeholder={t("actions.batch_number")}
          />
          {errors.batch_number ? (
            <Text className="text-destructive text-xs mt-1">
              {errors.batch_number}
            </Text>
          ) : null}
        </View>

        {/* Remaining fields */}
        {OTHER_INPUT_FIELDS.map((field) => (
          <View key={field.key} className="mb-2">
            <Label>{field.label}</Label>
            <Input
              className={`w-full ${errors[field.key] ? "border-destructive" : ""}`}
              value={formData[field.key] ?? ""}
              onChangeText={(text) => handleChange(field.key, text)}
            />
            {errors[field.key] ? (
              <Text className="text-destructive text-xs mt-1">
                {errors[field.key]}
              </Text>
            ) : null}
          </View>
        ))}

        <Row className="flex-none w-full" gap={8}>
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => router.back()}
          >
            <Text>{capitalizeFirst(t("common.cancel"))}</Text>
          </Button>
          <Button
            className="flex-1"
            onPress={handleSave}
            disabled={!isFormValid}
          >
            <Text>{capitalizeFirst(t("common.save"))}</Text>
          </Button>
        </Row>
      </ScrollView>
    </RootView>
  );
}
