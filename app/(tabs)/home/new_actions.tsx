import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import React from "react";
import { ScrollView } from "react-native";
import { Action } from "~/@types/action";
import { Factory } from "~/assets/images/icons/Factory";
import { Plus } from "~/assets/images/icons/Plus";
import { Store } from "~/assets/images/icons/Store";
import { Alert } from "~/components/alert/Alert";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function NewActions() {
  const { mutate: createNewActions } = useFetchMutation(
    "/actions/{stock_category}",
    "post"
  );

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G", actionsJsonEncoded } = rawParams as {
    stockCategory?: "PF_G" | "PF_M";
    actionsJsonEncoded?: string;
  };

  // ✅ Parse all actions from query param
  const [actions, setActions] = React.useState<Action[]>(() => {
    if (!actionsJsonEncoded) return [];
    try {
      return JSON.parse(actionsJsonEncoded) as Action[];
    } catch (err) {
      console.error("Invalid actionsJsonEncoded:", err);
      return [];
    }
  });

  const handleSaveNewActions = () => {
    if (actions.length === 0) return;
    createNewActions(
      {
        pathParams: { stock_category: stockCategory },
        body: actions,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  const handleNewAction = () => {
    router.push({
      pathname: "/home/new_action",
      params: {
        actionsJsonEncoded: JSON.stringify(actions),
        stockCategory,
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };
  const handleEdit = (actionToBeEdited: Action) => {
    router.push({
      pathname: "/home/new_action",
      params: {
        actionsJsonEncoded: JSON.stringify(actions),
        editActionId : actionToBeEdited.id,
        stockCategory,
      },
    });
  }

  const handleDelete = (actionToBeDeleted: Action) => {
    Alert.alert(t("Please confirm"), t("Do you really want to discard the unsaved changes?"), [
      {
        text: t("common.cancel"),
        onPress: () => console.info("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: t("common.OK"),
        onPress: () => {
          setActions((prev) =>
            prev.filter((a) => a.id !== actionToBeDeleted.id)
          );
        },
      },
    ]);
  };

  return (
    <RootView disableInsets={{ left: true}}>
      <Text variant="h2" className="mb-2">
        <Row className="w-full justify-between">
          <Text className="text-4xl">
            {capitalizeFirst(t("actions.newActions"))}
          </Text>
          <Tooltip>
            <TooltipTrigger>
              {stockCategory === "PF_G" && <Factory />}
              {stockCategory === "PF_M" && <Store />}
            </TooltipTrigger>
            <TooltipContent>
              <Text>
                {capitalizeFirst(t("stocks.finishedProducts"))}
                {" - "}
                {t(("stocks." + stockCategory) as "stocks.PF_G")}
              </Text>
            </TooltipContent>
          </Tooltip>
        </Row>
      </Text>
      <ScrollView>
        <ActionTable
          data={actions}
          totalRow={true}
          editionMode={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
          hiddenColumns={["created_by_id", "created_at"]}
        />

        <Button
          className="mb-4"
          variant={"outline"}
          icon={Plus}
          onPress={handleNewAction}
        >
          {capitalizeFirst(t("actions.newAction"))}
        </Button>

        <Row className="flex-none w-full" gap={8}>
          <Button className="flex-1" variant={"outline"} onPress={handleCancel}>
            {capitalizeFirst(t("common.cancel"))}
          </Button>
          <Button
            className="flex-1"
            onPress={handleSaveNewActions}
            disabled={actions.length === 0}
          >
            {capitalizeFirst(t("common.save"))}
          </Button>
        </Row>
      </ScrollView>
    </RootView>
  );
}
