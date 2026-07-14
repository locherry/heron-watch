import { Clock, User as UserIcon, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { constants } from "~/lib/constants";
import { useActionHistory } from "~/lib/hooks/useActionHistory";
import { useFormatDate } from "~/lib/hooks/useFormatDate";
import { capitalizeFirst } from "~/lib/utils";
import Row from "../layout/Row";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

export function ActionHistoryModal({
  actionId,
  onClose,
}: {
  actionId: number | null;
  onClose: () => void;
}) {
  const [t] = useTranslation();
  const formatDate = useFormatDate();

  const { data = [], isLoading } = useActionHistory(actionId);

  const history = Array.isArray(data) ? data : (data?.member ?? []);

  return (
    <Modal
      visible={actionId !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-4">
        {/* Backdrop */}
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

        {/* Dialog */}
        <View className="w-full max-w-lg rounded-xl bg-background p-4">
          <Row className="mb-3 items-center justify-between">
            <Text className="text-lg font-bold">
              {capitalizeFirst(t("actions.historyTitle"))}
            </Text>

            <Button variant="ghost" onPress={onClose}>
              <Icon as={X} />
            </Button>
          </Row>

          {isLoading && (
            <View>
              {[0, 1, 2].map((index) => {
                const isLast = index === 2;

                return (
                  <View key={index} className="flex-row">
                    {/* Timeline */}
                    <View className="w-6 items-center">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      {!isLast && (
                        <View className="my-1 w-px flex-1 bg-border" />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 pb-4 pl-2">
                      <Row gap={6} className="items-center">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </Row>

                      <Skeleton className="mt-1.5 h-3 w-40 rounded" />

                      <Row gap={4} className="mt-2 items-center">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                      </Row>

                      <Row gap={4} className="mt-1.5 items-center">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-28 rounded" />
                      </Row>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {!isLoading && history.length === 0 && (
            <Text className="text-muted-foreground">
              {capitalizeFirst(t("actions.noHistory"))}
            </Text>
          )}

          <ScrollView
            style={{ maxHeight: 480 }}
            showsVerticalScrollIndicator={history.length > 0}
          >
            {history.map((entry, index) => {
              const isLast = index === history.length - 1;

              return (
                <View key={entry.id} className="flex-row">
                  {/* Timeline */}
                  <View className="w-6 items-center">
                    <View
                      className={
                        entry.corrected
                          ? "h-3 w-3 rounded-full bg-muted-foreground"
                          : "h-3 w-3 rounded-full bg-amber-500"
                      }
                    />

                    {!isLast && <View className="my-1 w-px flex-1 bg-border" />}
                  </View>

                  {/* Content */}
                  <View className="flex-1 pb-4 pl-2">
                    <Row gap={6} className="items-center">
                      <Icon
                        as={
                          constants.actionTypes.find(
                            (type) =>
                              type.label === entry.action_category.action_name,
                          )?.icon ?? constants.actionTypes[0].icon
                        }
                      />

                      <Text className="font-semibold">
                        {entry.action_category.action_name
                          ? t(entry.action_category.action_name as "I stock")
                          : "-"}
                      </Text>

                      {entry.corrected ? (
                        <View className="rounded-full bg-muted px-2 py-0.5">
                          <Text className="text-xs text-muted-foreground">
                            {capitalizeFirst(t("actions.longCorrectedBadge"))}
                          </Text>
                        </View>
                      ) : (
                        <View className="rounded-full bg-amber-100 px-2 py-0.5">
                          <Text className="text-xs text-amber-800">
                            {capitalizeFirst(t("actions.longCorrectionBadge"))}
                          </Text>
                        </View>
                      )}
                    </Row>

                    <Text className="text-sm text-muted-foreground">
                      {entry.action_category.addition_rule === "+" ? "+" : "-"}
                      {entry.quantity} · {entry.product.product_code} ·{" "}
                      {entry.batch_number}
                    </Text>

                    <Row gap={4} className="mt-1 items-center">
                      <Icon
                        as={Clock}
                        size={12}
                        className="text-muted-foreground"
                      />

                      <Text className="text-xs text-muted-foreground">
                        {formatDate(new Date(entry.created_at))}
                      </Text>
                    </Row>

                    <Row gap={4} className="items-center">
                      <Icon
                        as={UserIcon}
                        size={12}
                        className="text-muted-foreground"
                      />

                      <Text className="text-xs text-muted-foreground">
                        {entry.created_by
                          ? `${entry.created_by.first_name} ${entry.created_by.last_name}`
                          : t("user.unknownUser")}
                      </Text>
                    </Row>

                    {entry.comment && (
                      <Text className="mt-1 text-xs italic text-muted-foreground">
                        “{entry.comment}”
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
