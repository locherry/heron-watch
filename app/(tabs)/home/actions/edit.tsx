import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { AlertTriangle, History } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { DateInput } from "~/components/DateInput";
import Header from "~/components/Header";
import { InfoTooltip } from "~/components/InfoTooltip";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
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
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useBreakpoint } from "~/lib/hooks/useBreakpoint";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

type CorrectionFormKey =
  | "quantity"
  | "expire_at"
  | "transaction_code"
  | "comment";

type CorrectionFormData = {
  quantity: string;
  expire_at: Date | null;
  transaction_code: string;
  comment: string;
};

type CorrectionFormErrors = Partial<Record<CorrectionFormKey, string>>;

export default function EditAction() {
  const [t] = useTranslation();
  const queryClient = useQueryClient();
  const { isSmallWidth } = useBreakpoint();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: action,
    isLoading,
    isError,
  } = useFetchQuery(
    "/api/actions/{id}",
    "get",
    { path: { id: id ?? "" } },
    undefined,
    !!id,
  );

  const { mutate: submitCorrection, isPending } = useFetchMutation(
    "/api/actions/{id}/correct",
    "post",
  );

  /* --------------------------------- State --------------------------------- */

  const [formData, setFormData] = React.useState<CorrectionFormData>({
    quantity: "",
    expire_at: null,
    transaction_code: "",
    comment: "",
  });
  const [errors, setErrors] = React.useState<CorrectionFormErrors>({});
  const [actionCategoryId, setActionCategoryId] = React.useState<string>("");

  React.useEffect(() => {
    if (!action) return;
    setFormData({
      quantity: action.quantity?.toString() ?? "",
      expire_at: action.expire_at ? new Date(action.expire_at) : null,
      transaction_code: action.transaction_code ?? "",
      comment: action.comment ?? "",
    });
    setActionCategoryId(
      action.action_category?.id?.toString() ??
        String(constants.actionTypes[0].value),
    );
  }, [action]);

  /* ------------------------------ Validation -------------------------------- */

  const validators: {
    [K in CorrectionFormKey]?: (value: CorrectionFormData[K]) => string;
  } = {
    quantity: (v) =>
      !v
        ? t("errors.required")
        : !/^\d+$/.test(v)
          ? capitalizeFirst(t("errors.invalidQuantity"))
          : "",
    expire_at: (v) =>
      !v
        ? t("errors.required")
        : isNaN(v.getTime())
          ? capitalizeFirst(t("errors.invalidExpirationDate"))
          : "",
  };

  const validateField = <K extends CorrectionFormKey>(
    key: K,
    value: CorrectionFormData[K],
  ): string => validators[key]?.(value) ?? "";

  const isFormValid = (Object.keys(validators) as CorrectionFormKey[]).every(
    (key) =>
      !validateField(key, formData[key] as CorrectionFormData[typeof key]),
  );

  const updateField = <K extends CorrectionFormKey>(
    key: K,
    value: CorrectionFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const handleSave = () => {
    if (!id) return;
    submitCorrection(
      {
        params: { path: { id } },
        body: {
          quantity: Number(formData.quantity),
          expire_at: formData.expire_at!.toISOString(),
          action_category: `/api/action_categories/${actionCategoryId}`,
          transaction_code: formData.transaction_code || undefined,
          comment: formData.comment || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/actions"] });
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("actions.correctionCreated"),
          });
          router.back();
        },
        onError: (error: any) => {
          console.error(error);
          const isConflict = error?.response?.status === 409;
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: isConflict
              ? t("actions.alreadyCorrected")
              : t("actions.correctionFailed"),
          });
        },
      },
    );
  };

  const selectedActionType = constants.actionTypes.find(
    (o) => String(o.value) === actionCategoryId,
  );

  if (isError) {
    return (
      <RootView disableInsets={{ left: true }}>
        <Header title={capitalizeFirst(t("actions.editAction"))} />
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Icon as={AlertTriangle} size={32} className="text-destructive" />
          <Text className="text-center text-muted-foreground">
            {capitalizeFirst(t("actions.notFound"))}
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>{capitalizeFirst(t("common.back"))}</Text>
          </Button>
        </View>
      </RootView>
    );
  }

  if (!isLoading && action?.corrected) {
    return (
      <RootView disableInsets={{ left: true }}>
        <Header title={capitalizeFirst(t("actions.editAction"))} />
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Icon as={History} size={32} className="text-muted-foreground" />
          <Text className="text-center text-muted-foreground max-w-xs">
            {capitalizeFirst(t("actions.alreadyCorrectedDescription"))}
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>{capitalizeFirst(t("common.back"))}</Text>
          </Button>
        </View>
      </RootView>
    );
  }

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <Header title={capitalizeFirst(t("actions.editAction"))} />

        {/* ── Identity summary (read-only) ──────────────────────────────── */}
        <Card className="mb-4 bg-accent p-3">
          <Row gap={6} className="items-center">
            <Text className="text-xs text-muted-foreground shrink">
              {capitalizeFirst(t("actions.correctingNotice"))}
            </Text>
            <InfoTooltip
              text={capitalizeFirst(t("actions.correctingNoticeDetails"))}
            />
          </Row>

          {isLoading ? (
            <Skeleton className="h-4 w-2/3 rounded" />
          ) : (
            <Row gap={12}>
              <Text className="font-bold">
                {action?.product?.product_code}
                {!isSmallWidth && " - " + action?.product?.product_name}
              </Text>
              <Text className="text-muted-foreground">
                {action?.batch_number}
              </Text>
            </Row>
          )}
        </Card>

        {/* ── Action type ────────────────────────────────────────────────── */}
        <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
        <Row gap={8} className="mb-4">
          <Select
            className="flex-1"
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
        </Row>

        {/* ── Quantity ──────────────────────────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.quantity"))}</Label>
          <Input
            className={errors.quantity ? "border-destructive" : ""}
            value={formData.quantity}
            onChangeText={(text) => updateField("quantity", text)}
            keyboardType="numeric"
            editable={!isLoading}
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
            placeholder={capitalizeFirst(t("actions.expireAt"))}
            disabled={isLoading}
          />
          {errors.expire_at ? (
            <Text className="text-destructive text-xs mt-1">
              {errors.expire_at}
            </Text>
          ) : null}
        </View>

        {/* ── Transaction code (optional) ───────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.transaction"))}</Label>
          <Input
            value={formData.transaction_code}
            onChangeText={(text) => updateField("transaction_code", text)}
            editable={!isLoading}
          />
        </View>

        {/* ── Comment (optional) ────────────────────────────────────────── */}
        <View className="mb-2">
          <Label>{capitalizeFirst(t("actions.comment"))}</Label>
          <Input
            value={formData.comment}
            onChangeText={(text) => updateField("comment", text)}
            editable={!isLoading}
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
            disabled={!isFormValid || isLoading || isPending}
          >
            <Text>
              {isPending
                ? capitalizeFirst(t("common.loading"))
                : capitalizeFirst(t("common.save"))}
            </Text>
          </Button>
        </Row>
      </ScrollView>
    </RootView>
  );
}
