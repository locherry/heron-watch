import { router } from "expo-router";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import Column from "~/components/layout/Column";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
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
import { Gift } from "~/lib/icons/Gift";
import { Package } from "~/lib/icons/Package";
import { QrCode } from "~/lib/icons/QrCode";
import { Store } from "~/lib/icons/Store";
import { Tag } from "~/lib/icons/Tag";
import { capitalizeFirst } from "~/lib/utils";

export default function NewActions() {
  const ACTION_TYPES = [
    { value: "1", label: t("actions.1"), icon: Tag },
    { value: "2", label: t("actions.2"), icon: Package },
    { value: "3", label: t("actions.3"), icon: Gift },
    { value: "4", label: t("actions.4"), icon: Store },
  ] as const;
  const [actionType, setActionType] = React.useState<
    (typeof ACTION_TYPES)[number]["value"]
  >(ACTION_TYPES[0].value);
  const handleSaveNewAction = () => {};
  const handleCancel = () => {
    router.back();
  };
  const INPUT_FIELDS = [
    { label: t("actions.product_code"), value: "product_code" },
    { label: t("actions.quantity"), value: "quantity" },
    { label: t("actions.transaction"), value: "transaction" },
    { label: t("actions.expirationDate"), value: "expiration_date" },
    { label: t("actions.comment"), value: "comment" },
  ] as const;
  return (
    <RootView>
      <Row className="flex-none w-full" gap={8}>
        <H2 className="flex-1">{capitalizeFirst(t("actions.newAction"))}</H2>
        <Button icon={QrCode} variant={"outline"} />
      </Row>
      <Column gap={16}>
        <Select
          defaultValue={ACTION_TYPES[0]}
          value={ACTION_TYPES.find((option) => option.value == actionType)}
          onValueChange={(option) =>
            setActionType(
              option?.value as (typeof ACTION_TYPES)[number]["value"]
            )
          }
        >
          {/* <SelectTrigger className="w-full mb-4">
          <Text>{capitalizeFirst(t("actions.selectActionType"))}</Text>
        </SelectTrigger> */}

          <SelectTrigger>
            <SelectValue
              // className="text-foreground text-sm native:text-lg flex flex-row items-center"
              placeholder={capitalizeFirst(t("actions.selectActionType"))}
            >
              <View className="mr-2 flex flex-row items-center">
                {(() => {
                  const selectedOption = ACTION_TYPES.find(
                    (option) => option.value === actionType
                  );
                  if (selectedOption?.icon) {
                    return <selectedOption.icon className="mr-2" size={16} />;
                  }
                  return null; // If there's no icon, render nothing
                })()}
                <P className="capitalize">
                  {
                    ACTION_TYPES.find((option) => option.value == actionType)
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
          <Label key={field.value} className="mb-2">
            {capitalizeFirst(field.label)}
            <Input className="w-full" />
          </Label>
        ))}
      </Column>

      <Row className="flex-none w-full" gap={8}>
        <Button className="flex-1" variant={"outline"} onPress={handleCancel}>
          <Text>{capitalizeFirst(t("common.cancel"))}</Text>
        </Button>
        <Button
          className="flex-1"
          onPress={handleSaveNewAction}
        >
          <Text>{capitalizeFirst(t("common.save"))}</Text>
        </Button>
      </Row>
    </RootView>
  );
}
