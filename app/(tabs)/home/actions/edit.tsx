import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { AlertTriangle, History } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { ActionForm } from "~/components/form/ActionForm";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function EditAction() {
  const [t] = useTranslation();
  const queryClient = useQueryClient();
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

  if (isLoading || !action) {
    return (
      <RootView disableInsets={{ left: true }}>
        <Header title={capitalizeFirst(t("actions.editAction"))} />
        <View className="gap-4">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Row gap={8}>
            <Skeleton className="h-10 flex-1 rounded" />
            <Skeleton className="h-10 flex-1 rounded" />
          </Row>
        </View>
      </RootView>
    );
  }

  return (
    <RootView disableInsets={{ left: true }}>
      <ScrollView showsVerticalScrollIndicator>
        <ActionForm
          key={action.id}
          title={capitalizeFirst(t("actions.editAction"))}
          stockCategory={action.stock_category}
          defaultValues={{
            actionCategoryId:
              action.action_category?.id?.toString() ??
              String(constants.actionTypes[0].value),
            product_code: action.product?.product_code ?? "",
            batch_number: action.batch_number ?? "",
            quantity: action.quantity?.toString() ?? "",
            transaction_code: action.transaction_code ?? "",
            comment: action.comment ?? "",
            expire_at: action.expire_at ? new Date(action.expire_at) : null,
          }}
          submitLabel={capitalizeFirst(t("common.save"))}
          isSubmitting={isPending}
          onCancel={() => router.back()}
          onSubmit={(values) =>
            submitCorrection(
              {
                params: { path: { id: id! } },
                body: {
                  product_code: values.product_code,
                  batch_number: values.batch_number,
                  quantity: Number(values.quantity),
                  expire_at: values.expire_at!.toISOString(),
                  action_category: Number(values.actionCategoryId),
                  transaction_code: values.transaction_code || undefined,
                  comment: values.comment || undefined,
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
            )
          }
        />
      </ScrollView>
    </RootView>
  );
}
