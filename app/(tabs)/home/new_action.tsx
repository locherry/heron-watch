import { router, useLocalSearchParams } from "expo-router";
import { AlertTriangle, CheckCircle2 } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { StockCategory, StockRead } from "~/@types/stock";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import { DateInput } from "~/components/DateInput";
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

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type FormKey =
  | "product_code"
  | "batch_number"
  | "quantity"
  | "transaction_code"
  | "expire_at"
  | "comment";

type FormData = {
  product_code: string;
  batch_number: string;
  quantity: string;
  transaction_code: string;
  expire_at: Date | null;
  comment: string;
};

type FormErrors = Partial<Record<FormKey, string>>;

/* -------------------------------------------------------------------------- */
/*                              Stock Autocomplete Hook                       */
/* -------------------------------------------------------------------------- */

function useStockAutocomplete(stockMembers: StockRead[]) {
  const [filteredProductCodes, setFilteredProductCodes] = React.useState<
    StockRead[]
  >([]);
  const [filteredBatchNumbers, setFilteredBatchNumbers] = React.useState<
    StockRead[]
  >([]);

  React.useEffect(() => {
    if (stockMembers.length === 0) return;
    const seen = new Set<string>();
    setFilteredProductCodes(
      stockMembers.filter((s) => {
        const code = s.product?.product_code ?? "";
        if (seen.has(code)) return false;
        seen.add(code);
        return true;
      }),
    );
  }, [stockMembers]);

  const filterProductCodes = (text: string) => {
    const seen = new Set<string>();
    setFilteredProductCodes(
      stockMembers.filter((s) => {
        const code = s.product?.product_code ?? "";
        if (seen.has(code) || !code.includes(text)) return false;
        seen.add(code);
        return true;
      }),
    );
  };

  const filterBatchNumbers = (productCode: string, text = "") => {
    setFilteredBatchNumbers(
      stockMembers.filter(
        (s) =>
          s.product?.product_code === productCode &&
          (s.batch_number ?? "").includes(text),
      ),
    );
  };

  return {
    filteredProductCodes,
    filteredBatchNumbers,
    filterProductCodes,
    filterBatchNumbers,
    clearBatchNumbers: () => setFilteredBatchNumbers([]),
  };
}

/* -------------------------------------------------------------------------- */
/*                              QR Scanner Hook                               */
/* -------------------------------------------------------------------------- */

function useQrScanner(onLoad: (data: Partial<FormData>) => void) {
  const [t] = useTranslation();
  const [qrCodeId, setQrCodeId] = React.useState<number | null>(null);

  const qrResult = useFetchQuery(
    "/api/qr_codes/{id}",
    "get",
    { path: { id: (qrCodeId ?? 0).toString() } },
    undefined,
    !!qrCodeId,
  );

  React.useEffect(() => {
    if (!qrResult.data) return;
    const qr = qrResult.data;
    Toast.show({ type: "success", text1: t("QR Code loaded") });
    const rawDate = qr.expire_at ? new Date(qr.expire_at) : null;
    onLoad({
      product_code: qr.product_code ?? undefined,
      quantity: qr.quantity?.toString() ?? undefined,
      expire_at: rawDate && !isNaN(rawDate.getTime()) ? rawDate : null,
    });
  }, [qrResult.data]);

  const onScan = (data: string) => {
    const id = parseInt(data);
    if (isNaN(id)) {
      Toast.show({
        type: "error",
        text1: "Invalid data",
        text2: `${data} is not a number.`,
      });
    } else {
      setQrCodeId(id);
    }
  };

  return { onScan };
}

/* -------------------------------------------------------------------------- */
/*                            Field Feedback                                  */
/* -------------------------------------------------------------------------- */

type FeedbackProps =
  | { type: "error"; message: string }
  | { type: "success"; message: string }
  | { type: "warning"; message: string }
  | { type: "none" };

function FieldFeedback(props: FeedbackProps) {
  if (props.type === "none") return null;

  const config = {
    error: { icon: AlertTriangle, className: "text-destructive" },
    success: {
      icon: CheckCircle2,
      className: "text-green-600 dark:text-green-400",
    },
    warning: {
      icon: AlertTriangle,
      className: "text-yellow-600 dark:text-yellow-400",
    },
  } as const;

  const { icon, className } = config[props.type];

  return (
    <Row gap={4} className="mt-1 items-center">
      <Icon as={icon} size={13} className={className} />
      <Text className={`text-xs ${className}`}>{props.message}</Text>
    </Row>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function NewAction() {
  const [t] = useTranslation();
  const { addAction, editAction, actions } = useDraftActionsStore();
  const { editActionId } = useLocalSearchParams<{ editActionId?: string }>();

  const actionToEdit = editActionId
    ? actions.find((a) => a.id === Number(editActionId))
    : undefined;

  const { stockCategory } = useLocalSearchParams<{
    stockCategory?: StockCategory;
  }>();

  /* --------------------------------- State --------------------------------- */

  const [formData, setFormData] = React.useState<FormData>({
    product_code: actionToEdit?.product_code ?? "",
    batch_number: actionToEdit?.batch_number ?? "",
    quantity: actionToEdit?.quantity?.toString() ?? "",
    transaction_code: actionToEdit?.transaction_code ?? "",
    comment: actionToEdit?.comment ?? "",
    expire_at: actionToEdit?.expire_at
      ? new Date(actionToEdit.expire_at)
      : null,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isExpireLocked, setIsExpireLocked] = React.useState(
    // Lock on edit if the date came from an existing stock entry
    !!actionToEdit?.expire_at,
  );
  const [actionCategoryId, setActionCategoryId] = React.useState(
    actionToEdit?.action_category?.toString() ??
      String(constants.actionTypes[0].value),
  );

  /* --------------------------------- Stock --------------------------------- */

  const { data: stockData } = useFetchQuery("/api/stock/current_stock", "get", {
    query: { stock_category: stockCategory },
  });
  const stockMembers = (stockData?.member as StockRead[]) ?? [];

  const {
    filteredProductCodes,
    filteredBatchNumbers,
    filterProductCodes,
    filterBatchNumbers,
    clearBatchNumbers,
  } = useStockAutocomplete(stockMembers);

  const isProductCodeInDb = stockMembers.some(
    (s) => s.product?.product_code === formData.product_code,
  );
  const isBatchNumberInDb = stockMembers.some(
    (s) => s.batch_number === formData.batch_number,
  );

  /* ------------------------------ Validation ------------------------------- */

  const validators: { [K in FormKey]?: (value: FormData[K]) => string } = {
    product_code: (v) =>
      !v
        ? t("errors.required")
        : !/^\d{3}.*$/.test(v)
          ? capitalizeFirst(t("errors.invalidProductCode"))
          : "",
    batch_number: (v) =>
      !v
        ? t("errors.required")
        : !/^[A-Z]{3}\d{6}$/.test(v)
          ? capitalizeFirst(t("errors.invalidbatchNumber"))
          : "",
    quantity: (v) =>
      !v
        ? t("errors.required")
        : !/^\d+$/.test(v)
          ? capitalizeFirst(t("errors.invalidQuantity"))
          : "",
    expire_at: (v) =>
      !v
        ? t("errors.required")
        : isNaN(v.getTime()) // ← v is now properly typed as Date | null
          ? capitalizeFirst(t("errors.invalidExpirationDate"))
          : "",
  };

  const validateField = <K extends FormKey>(
    key: K,
    value: FormData[K],
  ): string => validators[key]?.(value) ?? "";

  const isFormValid = (Object.keys(validators) as FormKey[]).every(
    (key) => !validateField(key, formData[key] as FormData[typeof key]),
  );

  /* -------------------------------- Helpers -------------------------------- */

  const updateField = <K extends FormKey>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const patchForm = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  /* ----------------------------- QR Scanner -------------------------------- */

  const { onScan } = useQrScanner(patchForm);

  /* -------------------------- Autocomplete handlers ------------------------ */
  const handleProductCodeChange = (text: string) => {
    updateField("product_code", text);
    updateField("batch_number", "");
    updateField("expire_at", null);
    setIsExpireLocked(false);
    filterProductCodes(text);
    clearBatchNumbers();
  };

  const handleProductCodeSelect = (item: { value: string }) => {
    updateField("product_code", item.value);
    updateField("batch_number", "");
    updateField("expire_at", null);
    setIsExpireLocked(false);
    filterBatchNumbers(item.value);
  };

  const handleBatchNumberChange = (text: string) => {
    updateField("batch_number", text);
    setIsExpireLocked(false);
    filterBatchNumbers(formData.product_code, text);
  };

  const handleBatchNumberSelect = (item: { value: string }) => {
    updateField("batch_number", item.value);
    const stock = stockMembers.find(
      (s) =>
        s.product?.product_code === formData.product_code &&
        s.batch_number === item.value,
    );
    if (stock?.expire_at) {
      const d = new Date(stock.expire_at);
      const validDate = isNaN(d.getTime()) ? null : d;
      updateField("expire_at", validDate);
      setIsExpireLocked(validDate !== null);
    } else {
      setIsExpireLocked(false);
    }
  };

  /* --------------------------------- Save ---------------------------------- */

  const handleSave = () => {
    actionToEdit
      ? editAction(actionToEdit.id, {
          product_code: formData.product_code,
          batch_number: formData.batch_number,
          quantity: Number(formData.quantity),
          expire_at: formData.expire_at!.toISOString(),
          action_category: Number(actionCategoryId),
          transaction_code: formData.transaction_code || undefined,
          comment: formData.comment || undefined,
        })
      : addAction({
          product_code: formData.product_code,
          batch_number: formData.batch_number,
          quantity: Number(formData.quantity),
          expire_at: formData.expire_at!.toISOString(),
          action_category: Number(actionCategoryId),
          transaction_code: formData.transaction_code || undefined,
          comment: formData.comment || undefined,
        });
    router.replace("/home/new_actions");
  };

  /* --------------------------------- JSX ----------------------------------- */

  const selectedActionType = constants.actionTypes.find(
    (o) => String(o.value) === actionCategoryId,
  );

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <Header
          title={capitalizeFirst(t("actions.newAction"))}
          className="justify-between"
        >
          <Icon as={constants.stockCategoryIcon[stockCategory ?? "PF_G"]} />
        </Header>

        {/* ── Action type + QR scanner ───────────────────────────────────── */}
        <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
        <Row gap={8} className="mb-4">
          <Select
            className="flex-1"
            defaultValue={constants.actionTypes[0]}
            value={selectedActionType}
            onValueChange={(option) =>
              setActionCategoryId(String(option?.value ?? ""))
            }
          >
            <SelectTrigger className="w-full">
              <Row gap={8}>
                {selectedActionType?.icon && (
                  <Icon as={selectedActionType.icon} />
                )}
                <Text>
                  {selectedActionType &&
                    capitalizeFirst(t(selectedActionType.label))}
                </Text>
              </Row>
            </SelectTrigger>
            <SelectContent>
              {(["+", "-"] as const).map((rule) => (
                <SelectGroup key={rule}>
                  <SelectLabel>
                    {capitalizeFirst(
                      t(rule === "+" ? "common.add" : "common.substract"),
                    )}{" "}
                    ({rule})
                  </SelectLabel>
                  {constants.actionTypes
                    .filter((a) => a.additionRule === rule)
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
              ))}
            </SelectContent>
          </Select>
          <QrScannerButton onScan={onScan} />
        </Row>

        {/* ── Product code ──────────────────────────────────────────────── */}
        <View className="mb-2 z-20">
          <Label>{capitalizeFirst(t("actions.product_code"))}</Label>
          <AutocompleteInput
            data={filteredProductCodes.map((s) => ({
              label: s.product?.product_code ?? "",
              value: s.product?.product_code ?? "",
            }))}
            value={formData.product_code}
            onChangeText={handleProductCodeChange}
            onSelect={handleProductCodeSelect}
            placeholder={t("actions.product_code")}
          />
          {errors.product_code ? (
            <FieldFeedback type="error" message={errors.product_code} />
          ) : formData.product_code && isProductCodeInDb ? (
            <FieldFeedback
              type="success"
              message={capitalizeFirst(t("validation.productCodeInDb"))}
            />
          ) : formData.product_code && !isProductCodeInDb ? (
            <FieldFeedback
              type="error"
              message={capitalizeFirst(t("validation.productCodeNotInDb"))}
            />
          ) : null}
        </View>

        {/* ── Batch number ──────────────────────────────────────────────── */}
        <View className="mb-2 z-10">
          <Label>{capitalizeFirst(t("actions.batch_number"))}</Label>
          <AutocompleteInput
            data={filteredBatchNumbers.map((s) => ({
              label: s.batch_number ?? "",
              value: s.batch_number ?? "",
            }))}
            value={formData.batch_number}
            onChangeText={handleBatchNumberChange}
            onSelect={handleBatchNumberSelect}
            placeholder={t("actions.batch_number")}
          />
          {errors.batch_number ? (
            <FieldFeedback type="error" message={errors.batch_number} />
          ) : formData.batch_number && isBatchNumberInDb ? (
            <FieldFeedback
              type="success"
              message={capitalizeFirst(t("validation.batchNumberInDb"))}
            />
          ) : formData.batch_number && !errors.batch_number ? (
            <FieldFeedback
              type="warning"
              message={capitalizeFirst(t("validation.batchNumberNew"))}
            />
          ) : null}
        </View>

        {/* ── Quantity ──────────────────────────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.quantity"))}</Label>
          <Input
            className={errors.quantity ? "border-destructive" : ""}
            value={formData.quantity}
            onChangeText={(text) => updateField("quantity", text)}
            keyboardType="numeric"
          />
          {errors.quantity ? (
            <Text className="text-destructive text-xs mt-1">
              {errors.quantity}
            </Text>
          ) : null}
        </View>

        {/* ── Expiration date ───────────────────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.expireAt"))}</Label>
          <DateInput
            value={formData.expire_at ?? undefined}
            onChange={(date) => updateField("expire_at", date)}
            placeholder={t("actions.expireAt")}
            disabled={isExpireLocked} // ← pass disabled prop
          />
          {errors.expire_at ? (
            <FieldFeedback type="error" message={errors.expire_at} />
          ) : isExpireLocked ? (
            <FieldFeedback
              type="success"
              message={capitalizeFirst(t("validation.expireDateAutoFilled"))}
            />
          ) : !isNaN(formData.expire_at?.getTime() ?? NaN) ? (
            <FieldFeedback
              type="warning"
              message={capitalizeFirst(
                t("validation.expireDateWillBeLinkedToNewBatchNumber"),
              )}
            />
          ) : null}
        </View>

        {/* ── Transaction code (optional) ───────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.transaction"))}</Label>
          <Input
            value={formData.transaction_code}
            onChangeText={(text) => updateField("transaction_code", text)}
          />
        </View>

        {/* ── Comment (optional) ────────────────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.comment"))}</Label>
          <Input
            value={formData.comment}
            onChangeText={(text) => updateField("comment", text)}
          />
        </View>

        {/* ── Actions ───────────────────────────────────────────────────── */}
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
