import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { StockCategory } from "~/@types/stock";
import { Alert } from "~/components/alert/Alert";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { DraftActionTable } from "~/components/table/DraftActionTable";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useDraftActionsStore } from "~/lib/stores/useDraftActionsStore";
import { capitalizeFirst } from "~/lib/utils";

export default function NewActions() {
  const [t] = useTranslation();
  const queryClient = useQueryClient();
  const {
    actions,
    stockCategory,
    setStockCategory,
    deleteAction,
    clearActions,
  } = useDraftActionsStore();

  const { mutate: createNewActions, isPending } = useFetchMutation(
    "/api/actions/batch",
    "post",
  );

  const { stockCategory: paramStockCategory } = useLocalSearchParams<{
    stockCategory?: StockCategory;
  }>();

  React.useEffect(() => {
    if (paramStockCategory) setStockCategory(paramStockCategory);
  }, [paramStockCategory]);

  const handleSave = () => {
    if (actions.length === 0) return;
    createNewActions(
      {
        body: {
          actions: actions.map((a) => ({
            stock_category: stockCategory,
            product_code: a.product_code,
            batch_number: a.batch_number,
            quantity: a.quantity,
            action_category: a.action_category,
            expire_at: a.expire_at,
            comment: a.comment,
            transaction_code: a.transaction_code,
          })),
        },
      },
      {
        onSuccess: () => {
          clearActions();
          queryClient.invalidateQueries({ queryKey: ["/api/actions"] });
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("actions.newActionsCreated"),
          });
          router.push({ pathname: "/home", params: { stockCategory } });
        },
        onError: (error) => {
          console.error(error);
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t("actions.newActionsCreated"),
          });
        },
      },
    );
  };

  const handleEdit = (actionToBeEdited: any) => {
    router.push({
      pathname: "/home/new_action",
      params: { editActionId: actionToBeEdited.original.id },
    });
  };

  const handleDelete = (actionToBeDeleted: any) => {
    Alert.alert(
      t("Please confirm"),
      t("Do you really want to discard the unsaved changes?"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.OK"),
          onPress: () => deleteAction(actionToBeDeleted.original.id),
        },
      ],
    );
  };

  return (
    <RootView disableInsets={{ left: true }}>
      <Header
        title={capitalizeFirst(t("actions.newActions"))}
        className="justify-between"
      >
        <Icon as={constants.stockCategoryIcon[stockCategory]} />
      </Header>

      <DraftActionTable
        data={actions}
        totalRow={true}
        editEnabled={true}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <Button
        className="mb-4"
        variant="outline"
        icon={Plus}
        onPress={() => router.push("/home/new_action")}
      >
        {capitalizeFirst(t("actions.newAction"))}
      </Button>

      <Row className="flex-none w-full" gap={8}>
        <Button
          className="flex-1"
          variant="outline"
          onPress={() => router.back()}
        >
          {capitalizeFirst(t("common.cancel"))}
        </Button>
        <Button
          className="flex-1"
          onPress={handleSave}
          disabled={actions.length === 0 || isPending}
        >
          {isPending ? (
            <>
              <ActivityIndicator color={"#000"} />
              <Text>{capitalizeFirst(t("common.loading"))}</Text>
            </>
          ) : (
            <Text>{capitalizeFirst(t("common.save"))}</Text>
          )}
        </Button>
      </Row>
    </RootView>
  );
}
