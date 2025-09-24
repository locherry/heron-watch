import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { Plus } from "lucide-react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { Action } from "~/@types/action";
import { StockCategory } from "~/@types/stock";
import { Alert } from "~/components/alert/Alert";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { ActionTable } from "~/components/table/ActionTable";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function NewActions() {
  const { mutate: createNewActions } = useFetchMutation(
    "/actions/{stock_category}",
    "post"
  );

  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G", actionsJsonEncoded } = rawParams as {
    stockCategory?: StockCategory;
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
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("actions.newActionsCreated"),
          });
          router.push({pathname : "/home", params : { stockCategory }});
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
        editActionId: actionToBeEdited.id,
        stockCategory,
      },
    });
  };

  const handleDelete = (actionToBeDeleted: Action) => {
    Alert.alert(
      t("Please confirm"),
      t("Do you really want to discard the unsaved changes?"),
      [
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
      ]
    );
  };

  return (
    <RootView disableInsets={{ left: true }}>
      <Header title={capitalizeFirst(t("actions.newActions"))} className="justify-between">
        <Tooltip>
          <TooltipTrigger>
            <Icon as={constants.stockCategoryIcon[stockCategory]}/>
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

      <ActionTable
        data={React.useMemo(() => actions, [actions])}
        totalRow={true}
        editEnabled={true}
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
    </RootView>
  );
}
