import { revalidateLogic, useForm } from "@tanstack/react-form";
import { AlertTriangle, CheckCircle2 } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { StockCategory, StockRead } from "~/@types/stock";
import { AutocompleteInput } from "~/components/AutoCompleteInput";
import { DateInput } from "~/components/DateInput";
import Header from "~/components/Header";
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type ActionFormValues = {
  actionCategoryId: string;
  product_code: string;
  batch_number: string;
  quantity: string;
  transaction_code?: string;
  comment?: string;
  expire_at: Date | null;
};

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

function useQrScanner(onLoad: (data: Partial<ActionFormValues>) => void) {
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

function fieldErrorMessage(
  errors: readonly ({ message?: string } | undefined)[],
) {
  return errors
    .filter((e): e is { message?: string } => e != null)
    .map((e) => e.message ?? "")
    .filter(Boolean)
    .join(", ");
}

/* -------------------------------------------------------------------------- */
/*                                  ActionForm                                */
/* -------------------------------------------------------------------------- */

type ActionFormProps = {
  title: string;
  stockCategory?: StockCategory;
  defaultValues: ActionFormValues;
  onSubmit: (values: ActionFormValues) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  onCancel: () => void;
};

export function ActionForm({
  title,
  stockCategory,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}: ActionFormProps) {
  const [t] = useTranslation();

  const actionFormSchema = React.useMemo(
    () =>
      z.object({
        actionCategoryId: z
          .string()
          .min(1, capitalizeFirst(t("errors.required"))),
        product_code: z
          .string()
          .min(1, capitalizeFirst(t("errors.required")))
          .regex(/^\d{3}.*$/, capitalizeFirst(t("errors.invalidProductCode"))),
        batch_number: z
          .string()
          .min(1, capitalizeFirst(t("errors.required")))
          .regex(
            /^[A-Z]{3}\d{6}$/,
            capitalizeFirst(t("errors.invalidbatchNumber")),
          ),
        quantity: z
          .string()
          .min(1, capitalizeFirst(t("errors.required")))
          .regex(/^\d+$/, capitalizeFirst(t("errors.invalidQuantity"))),
        expire_at: z
          .date({ error: capitalizeFirst(t("errors.required")) })
          .refine(
            (d) => !isNaN(d.getTime()),
            capitalizeFirst(t("errors.invalidExpirationDate")),
          ),
        transaction_code: z.string().optional(),
        comment: z.string().optional(),
      }),
    [t],
  );

  // Locked if this form loaded with an expire_at already tied to a known batch
  // (either an existing draft being re-edited, or an already-recorded action).
  const [isExpireLocked, setIsExpireLocked] = React.useState(
    !!defaultValues.expire_at,
  );

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

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: actionFormSchema },
    onSubmit: ({ value }) => onSubmit(value as ActionFormValues),
  });

  const { onScan } = useQrScanner((patch) => {
    (Object.keys(patch) as (keyof ActionFormValues)[]).forEach((key) => {
      form.setFieldValue(key, patch[key] as never);
    });
  });

  const isProductCodeInDb = (code: string) =>
    stockMembers.some((s) => s.product?.product_code === code);
  const isBatchNumberInDb = (batch: string) =>
    stockMembers.some((s) => s.batch_number === batch);

  return (
    <View>
      <Header title={title} className="justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <Icon as={constants.stockCategoryIcon[stockCategory ?? "PF_G"]} />
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
      </Header>

      {/* ── Action type + QR scanner ────────────────────────────────────── */}
      <form.Field name="actionCategoryId">
        {(field) => {
          const selected = constants.actionTypes.find(
            (o) => String(o.value) === field.state.value,
          );
          return (
            <View className="mb-4">
              <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
              <Row gap={8}>
                <Select
                  className="flex-1"
                  value={selected}
                  onValueChange={(option) =>
                    field.handleChange(String(option?.value ?? ""))
                  }
                >
                  <SelectTrigger className="w-full">
                    <Row gap={8}>
                      {selected?.icon && <Icon as={selected.icon} />}
                      <Text>
                        {selected && capitalizeFirst(t(selected.label))}
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
                          .map((a) => (
                            <SelectItem
                              key={a.value}
                              value={String(a.value)}
                              label={capitalizeFirst(t(a.label))}
                            >
                              <Icon as={a.icon} />
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <QrScannerButton onScan={onScan} />
              </Row>
            </View>
          );
        }}
      </form.Field>

      {/* ── Product code ─────────────────────────────────────────────────── */}
      <form.Field
        name="product_code"
        listeners={{
          onChange: () => {
            form.setFieldValue("batch_number", "");
            form.setFieldValue("expire_at", null);
            setIsExpireLocked(false);
            clearBatchNumbers();
          },
        }}
      >
        {(field) => (
          <View className="mb-2 z-20">
            <Label>{capitalizeFirst(t("actions.productCode"))}</Label>
            <AutocompleteInput
              data={filteredProductCodes.map((s) => ({
                label: s.product?.product_code ?? "",
                value: s.product?.product_code ?? "",
              }))}
              value={field.state.value}
              onChangeText={(text) => {
                field.handleChange(text);
                filterProductCodes(text);
              }}
              onSelect={(item) => {
                field.handleChange(item.value);
                filterBatchNumbers(item.value);
              }}
              placeholder={capitalizeFirst(t("actions.productCode"))}
            />
            {!field.state.meta.isValid ? (
              <FieldFeedback
                type="error"
                message={fieldErrorMessage(field.state.meta.errors)}
              />
            ) : field.state.value && isProductCodeInDb(field.state.value) ? (
              <FieldFeedback
                type="success"
                message={capitalizeFirst(t("validation.productCodeInDb"))}
              />
            ) : field.state.value ? (
              <FieldFeedback
                type="error"
                message={capitalizeFirst(t("validation.productCodeNotInDb"))}
              />
            ) : null}
          </View>
        )}
      </form.Field>

      {/* ── Batch number ─────────────────────────────────────────────────── */}
      <form.Field
        name="batch_number"
        listeners={{
          onChange: () => setIsExpireLocked(false),
        }}
      >
        {(field) => (
          <View className="mb-2 z-10">
            <Label>{capitalizeFirst(t("actions.batchNumber"))}</Label>
            <AutocompleteInput
              data={filteredBatchNumbers.map((s) => ({
                label: s.batch_number ?? "",
                value: s.batch_number ?? "",
              }))}
              value={field.state.value}
              onChangeText={(text) => {
                field.handleChange(text);
                filterBatchNumbers(form.getFieldValue("product_code"), text);
              }}
              onSelect={(item) => {
                field.handleChange(item.value);
                const stock = stockMembers.find(
                  (s) =>
                    s.product?.product_code ===
                      form.getFieldValue("product_code") &&
                    s.batch_number === item.value,
                );
                if (stock?.expire_at) {
                  const d = new Date(stock.expire_at);
                  const validDate = isNaN(d.getTime()) ? null : d;
                  form.setFieldValue("expire_at", validDate);
                  setIsExpireLocked(validDate !== null);
                } else {
                  setIsExpireLocked(false);
                }
              }}
              placeholder={capitalizeFirst(t("actions.batchNumber"))}
            />
            {!field.state.meta.isValid ? (
              <FieldFeedback
                type="error"
                message={fieldErrorMessage(field.state.meta.errors)}
              />
            ) : field.state.value && isBatchNumberInDb(field.state.value) ? (
              <FieldFeedback
                type="success"
                message={capitalizeFirst(t("validation.batchNumberInDb"))}
              />
            ) : field.state.value ? (
              <FieldFeedback
                type="warning"
                message={capitalizeFirst(t("validation.batchNumberNew"))}
              />
            ) : null}
          </View>
        )}
      </form.Field>

      {/* ── Quantity ─────────────────────────────────────────────────────── */}
      <form.Field name="quantity">
        {(field) => (
          <View className="mb-2">
            <Label>{capitalizeFirst(t("actions.quantity"))}</Label>
            <Input
              placeholder={capitalizeFirst(t("actions.quantity"))}
              className={!field.state.meta.isValid ? "border-destructive" : ""}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              keyboardType="numeric"
            />
            {!field.state.meta.isValid && (
              <FieldFeedback
                type="error"
                message={fieldErrorMessage(field.state.meta.errors)}
              />
            )}
          </View>
        )}
      </form.Field>

      {/* ── Expiration date ─────────────────────────────────────────────── */}
      <form.Field name="expire_at">
        {(field) => (
          <View className="mb-2">
            <Label>{capitalizeFirst(t("actions.expireAt"))}</Label>
            <DateInput
              value={field.state.value ?? undefined}
              onChange={field.handleChange}
              placeholder={capitalizeFirst(t("actions.expireAt"))}
              disabled={isExpireLocked}
            />
            {!field.state.meta.isValid ? (
              <FieldFeedback
                type="error"
                message={fieldErrorMessage(field.state.meta.errors)}
              />
            ) : isExpireLocked ? (
              <FieldFeedback
                type="success"
                message={capitalizeFirst(t("validation.expireDateAutoFilled"))}
              />
            ) : field.state.value && !isNaN(field.state.value.getTime()) ? (
              <FieldFeedback
                type="warning"
                message={capitalizeFirst(
                  t("validation.expireDateWillBeLinkedToNewBatchNumber"),
                )}
              />
            ) : null}
          </View>
        )}
      </form.Field>

      {/* ── Transaction code (optional) ─────────────────────────────────── */}
      <form.Field name="transaction_code">
        {(field) => (
          <View className="mb-2">
            <Label>{capitalizeFirst(t("actions.transaction"))}</Label>
            <Input
              value={field.state.value}
              onChangeText={field.handleChange}
            />
          </View>
        )}
      </form.Field>

      {/* ── Comment (optional) ──────────────────────────────────────────── */}
      <form.Field name="comment">
        {(field) => (
          <View className="mb-2">
            <Label>{capitalizeFirst(t("actions.comment"))}</Label>
            <Input
              value={field.state.value}
              onChangeText={field.handleChange}
            />
          </View>
        )}
      </form.Field>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <Row className="flex-none w-full" gap={8}>
        <Button className="flex-1" variant="outline" onPress={onCancel}>
          <Text>{capitalizeFirst(t("common.cancel"))}</Text>
        </Button>
        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Button
              className="flex-1"
              onPress={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting}
            >
              <Text>
                {isSubmitting
                  ? capitalizeFirst(t("common.loading"))
                  : submitLabel}
              </Text>
            </Button>
          )}
        </form.Subscribe>
      </Row>
    </View>
  );
}
