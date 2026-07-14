import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { StockCategory } from "~/@types/stock";
import { ActionForm } from "~/components/form/ActionForm";
import RootView from "~/components/layout/RootView";
import { constants } from "~/lib/constants";
import { useDraftActionsStore } from "~/lib/stores/useDraftActionsStore";
import { capitalizeFirst } from "~/lib/utils";

export default function NewAction() {
  const [t] = useTranslation();
  const { addAction, editAction, actions } = useDraftActionsStore();
  const { editActionId, stockCategory } = useLocalSearchParams<{
    editActionId?: string;
    stockCategory?: StockCategory;
  }>();

  const actionToEdit = editActionId
    ? actions.find((a) => a.id === Number(editActionId))
    : undefined;

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <ActionForm
          title={capitalizeFirst(t("actions.newAction"))}
          stockCategory={stockCategory}
          defaultValues={{
            actionCategoryId:
              actionToEdit?.action_category?.toString() ??
              String(constants.actionTypes[0].value),
            product_code: actionToEdit?.product_code ?? "",
            batch_number: actionToEdit?.batch_number ?? "",
            quantity: actionToEdit?.quantity?.toString() ?? "",
            transaction_code: actionToEdit?.transaction_code ?? "",
            comment: actionToEdit?.comment ?? "",
            expire_at: actionToEdit?.expire_at
              ? new Date(actionToEdit.expire_at)
              : null,
          }}
          submitLabel={capitalizeFirst(t("common.save"))}
          onCancel={() => router.back()}
          onSubmit={(values) => {
            const payload = {
              product_code: values.product_code,
              batch_number: values.batch_number,
              quantity: Number(values.quantity),
              expire_at: values.expire_at!.toISOString(),
              action_category: Number(values.actionCategoryId),
              transaction_code: values.transaction_code || undefined,
              comment: values.comment || undefined,
            };
            actionToEdit
              ? editAction(actionToEdit.id, payload)
              : addAction(payload);
            router.replace("/home/actions/drafts");
          }}
        />
      </ScrollView>
    </RootView>
  );
}
