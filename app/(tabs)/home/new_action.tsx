import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { ActionWrite } from "~/@types/action";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function NewAction() {
  const [t] = useTranslation();

  const rawParams = useLocalSearchParams();
  const {
    actionsJsonEncoded,
    stockCategory = "PF_G",
    editActionId,
  } = rawParams as {
    actionsJsonEncoded?: string;
    stockCategory?: "PF_G" | "PF_M";
    editActionId?: string;
  };

  const existingActions: ActionWrite[] = React.useMemo(() => {
    if (!actionsJsonEncoded) return [];
    try {
      return JSON.parse(actionsJsonEncoded) as ActionWrite[];
    } catch (err) {
      console.error("Invalid actionsJsonEncoded:", err);
      return [];
    }
  }, [actionsJsonEncoded]);

  const [actionId, setActionId] = React.useState<string | number>(
    constants.actionTypes[0].value,
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const INPUT_FIELDS = [
    {
      label: capitalizeFirst(t("actions.product_code")),
      value: "product_code",
      regex: /^\d{3}.*$/,
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidProductCode")),
    },
    {
      label: capitalizeFirst(t("actions.batch_number")),
      value: "batch_number",
      regex: /^[A-Z]{3}\d{6}$/,
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidbatchNumber")),
    },
    {
      label: capitalizeFirst(t("actions.quantity")),
      value: "quantity",
      regex: /^\d+$/,
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidQuantity")),
    },
    {
      label: capitalizeFirst(t("actions.expirationDate")),
      value: "expiration_date",
      regex: /^\d{4}-(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/,
      required: true,
      errorMessage: capitalizeFirst(t("errors.invalidExpirationDate")),
    },
    {
      label: capitalizeFirst(t("actions.transaction")),
      value: "transaction",
      regex: /^.*$/,
      required: false,
      errorMessage: "",
    },
    {
      label: capitalizeFirst(t("actions.comment")),
      value: "comment",
      regex: /^.*$/,
      required: false,
      errorMessage: "",
    },
  ] as const;

  const validateField = (key: string, value: string) => {
    const field = INPUT_FIELDS.find((f) => f.value === key);
    if (!field) return "";
    if (field.required && !value) return t("errors.required");
    if (value && field.regex && !field.regex.test(value))
      return field.errorMessage;
    return "";
  };

  const [formData, setFormData] = React.useState<
    Record<string, string | number | null | undefined>
  >({
    ...INPUT_FIELDS.reduce(
      (acc, field) => {
        acc[field.value] = "";
        return acc;
      },
      {} as Record<string, string | number | null | undefined>, // Update here to allow null
    ),
    action_id: actionId,
    id: 0,
  });
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  // Prefill form if editing
  React.useEffect(() => {
    if (!editActionId) return;

    const actionToEdit = existingActions.find(
      (a) => String(a.id) === editActionId,
    );
    if (actionToEdit) {
      setFormData((prev) => ({
        ...prev,
        ...actionToEdit,
        action_id: actionToEdit.id,
      }));
      setActionId(actionToEdit.action_id.toString());
    }
  }, [editActionId, existingActions]);

  const isFormValid = React.useMemo(() => {
    return INPUT_FIELDS.every((field) => {
      const value = formData[field.value]?.toString() ?? "";
      return !validateField(field.value, value);
    });
  }, [formData]);

  const handleSaveNewAction = () => {
    let updatedActions: ActionWrite[];

    if (editActionId) {
      // Edit mode: replace the action in the array
      updatedActions = existingActions.map((a) =>
        String(a.id) === editActionId
          ? ({
              ...a, // keep all original fields
              ...formData,
              action_id: actionId,
              id: a.id,
            } as ActionWrite)
          : a,
      );
    } else {
      // Add new action
      const maxId =
        existingActions.length > 0
          ? Math.max(...existingActions.map((a) => a.id ?? 0))
          : 0;

      const newAction: ActionWrite = {
        id: maxId + 1,
        quantity: Number(formData.quantity) || 0,
        comment: (formData.comment as string) || "",
        product_code: (formData.product_code as string) || "000",
        batch_number: (formData.batch_number as string) || "",
        created_at: new Date().toISOString(),
        action_id: Number(actionId),
        transaction: (formData.transaction as string) || "",
        expiration_date: (formData.expiration_date as string) || undefined,
      };

      updatedActions = [...existingActions, newAction];
    }

    router.push({
      pathname: "/home/new_actions",
      params: {
        actionsJsonEncoded: JSON.stringify(updatedActions),
        stockCategory,
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const onScan = (data: string) => {
    const int = parseInt(data);
    if (isNaN(int)) {
      Toast.show({
        type: "error",
        text1: "Invalid data",
        text2: data + "is not a number.",
      });
    } else {
      setQrCodeId(int);
    }
  };
  const [qrCodeId, setQrCodeId] = React.useState<number | null>(null);

  const qrCodeResults = useFetchQuery(
    "/qr-code/{qr_code_id}",
    "get",
    {
      path: {
        qr_code_id: qrCodeId ?? 0,
      },
    },
    undefined,
    !!qrCodeId,
  );

  React.useEffect(() => {
    if (qrCodeResults.data) {
      const qrData = qrCodeResults.data.data;
      Toast.show({
        type: "success",
        text1: t("QR Code loaded"),
      });

      // Prefill form fields if they exist in API data
      setFormData((prev) => ({
        ...prev,
        id: qrData?.id ?? prev.id,
        product_code: qrData?.product_code ?? prev.product_code,
        quantity: qrData?.quantity ?? prev.quantity,
        expiration_date: qrData?.expiration_date ?? prev.expiration_date,
      }));
    }
  }, [qrCodeResults.data]);

  const selectedOption = constants.actionTypes.find(
    (option) => option.value === actionId,
  );

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <Header
          title={capitalizeFirst(t("actions.newAction"))}
          className="justify-between"
        >
          <Tooltip>
            <TooltipTrigger>
              <Icon as={constants.stockCategoryIcon[stockCategory]} />
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
        {/* action type select... */}
        <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
        <Row gap={8} className="mb-4">
          <Select
            className="flex-1"
            defaultValue={constants.actionTypes[0]}
            value={selectedOption}
            onValueChange={(option) =>
              setActionId(
                option?.value as (typeof constants.actionTypes)[number]["value"],
              )
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
                  .filter((action) => action.additionRule == "+")
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
                  .filter((action) => action.additionRule == "-")
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

        {INPUT_FIELDS.map((field) => {
          const error = errors[field.value];
          return (
            <View key={field.value} className="mb-2">
              <Label>{capitalizeFirst(field.label)}</Label>
              <Input
                className={`w-full ${error ? "border-destructive" : ""}`}
                value={(formData[field.value] ?? "").toString()}
                onChangeText={(text) => handleChange(field.value, text)}
              />
              {error ? (
                <Text className="text-destructive text-xs mt-1">{error}</Text>
              ) : null}
            </View>
          );
        })}

        <Row className="flex-none w-full" gap={8}>
          <Button className="flex-1" variant={"outline"} onPress={handleCancel}>
            <Text>{capitalizeFirst(t("common.cancel"))}</Text>
          </Button>
          <Button
            className="flex-1"
            onPress={handleSaveNewAction}
            disabled={!isFormValid}
          >
            <Text>{capitalizeFirst(t("common.save"))}</Text>
          </Button>
        </Row>
      </ScrollView>
    </RootView>
  );
}
