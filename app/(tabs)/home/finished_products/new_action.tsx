import { router } from "expo-router";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { Gift } from "~/assets/images/icons/Gift";
import { Package } from "~/assets/images/icons/Package";
import { Store } from "~/assets/images/icons/Store";
import { Tag } from "~/assets/images/icons/Tag";
import Column from "~/components/layout/Column";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import QrScannerButton from "~/components/QrScannerButton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { H2, P } from "~/components/ui/typography";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function NewAction() {
  const ACTION_TYPES = [
    { value: "1", label: t("actions.1"), icon: Tag },
    { value: "2", label: t("actions.2"), icon: Package },
    { value: "3", label: t("actions.3"), icon: Gift },
    { value: "4", label: t("actions.4"), icon: Store },
  ] as const;

  const [actionId, setactionId] = React.useState<
    (typeof ACTION_TYPES)[number]["value"]
  >(ACTION_TYPES[0].value);

  const INPUT_FIELDS = [
    { label: t("actions.product_code"), value: "product_code" },
    { label: t("actions.quantity"), value: "quantity" },
    { label: t("actions.expirationDate"), value: "expiration_date" },
    { label: t("actions.transaction"), value: "transaction" },
    { label: t("actions.comment"), value: "comment" },
  ] as const;

  // Store input values in state
  const [formData, setFormData] = React.useState<
    Record<string, string | number | undefined>
  >({
    ...INPUT_FIELDS.reduce(
      (acc, field) => {
        acc[field.value] = "";
        return acc;
      },
      {} as Record<string, string>
    ),
    action_id: actionId,
    id: 0, // set id to 0 because the action isnt yet registered to the db, cant choose a valid id
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveNewAction = () => {
    const newAction = {
      ...formData,
      action_type: actionId,
    };

    router.push({
      pathname: "/home/finished_products/new_actions",
      params: { newActionJsonEncoded: JSON.stringify(newAction) },
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
    !!qrCodeId
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
        transaction: qrData?.transaction ?? prev.transaction,
      }));
    }
  }, [qrCodeResults.data]);

  return (
    <RootView>
      <Row gap={8} className="mb-4">
        <H2 className="flex-1">{capitalizeFirst(t("actions.newAction"))}</H2>
        <QrScannerButton onScan={onScan} />
      </Row>
      <Column gap={16}>
        <Select
          defaultValue={ACTION_TYPES[0]}
          value={ACTION_TYPES.find((option) => option.value == actionId)}
          onValueChange={(option) =>
            setactionId(option?.value as (typeof ACTION_TYPES)[number]["value"])
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={capitalizeFirst(t("actions.selectActionType"))}
            >
              <View className="mr-2 flex flex-row items-center">
                {(() => {
                  const selectedOption = ACTION_TYPES.find(
                    (option) => option.value === actionId
                  );
                  if (selectedOption?.icon) {
                    return <selectedOption.icon className="mr-2" size={16} />;
                  }
                  return null;
                })()}
                <P className="capitalize">
                  {
                    ACTION_TYPES.find((option) => option.value == actionId)
                      ?.label
                  }
                </P>
              </View>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((action) => (
              <SelectItem
                key={action.value}
                value={String(action.value)}
                label={capitalizeFirst(action.label)}
                icon={action.icon}
              />
            ))}
          </SelectContent>
        </Select>

        {INPUT_FIELDS.map((field) => (
          <View key={field.value} className="mb-2">
            <Label>{capitalizeFirst(field.label)}</Label>
            <Input
              className="w-full"
              value={(formData[field.value] ?? "").toString()}
              onChangeText={(text) => handleChange(field.value, text)}
            />
          </View>
        ))}
      </Column>

      <Row className="flex-none w-full" gap={8}>
        <Button className="flex-1" variant={"outline"} onPress={handleCancel}>
          <Text>{capitalizeFirst(t("common.cancel"))}</Text>
        </Button>
        <Button className="flex-1" onPress={handleSaveNewAction}>
          <Text>{capitalizeFirst(t("common.save"))}</Text>
        </Button>
      </Row>
    </RootView>
  );
}
