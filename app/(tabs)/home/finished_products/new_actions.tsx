import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { ScrollView } from "react-native";
import { Action } from "~/@types/action";
import { Factory } from "~/assets/images/icons/Factory";
import { Plus } from "~/assets/images/icons/Plus";
import { Store } from "~/assets/images/icons/Store";
import { ActionCreationTable } from "~/components/actions/ActionCreationTable";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { H2 } from "~/components/ui/typography";
import { useApiMutation } from "~/lib/hooks/useApiMutation";
import { capitalizeFirst } from "~/lib/utils";

let actions: Action[] = [];

export default function NewActions() {
  const { mutate: createNewActions } = useApiMutation(
    "/actions/{stock_category}",
    "post"
  );
  const handleSaveNewActions = () => {};
  const handleNewAction = () => {
    router.push("/home/finished_products/new_action");
  };
  const handleCancel = () => {
    router.back();
  };
  const rawParams = useLocalSearchParams();
  const { stockCategory = "PF_G", newActionJsonEncoded } = rawParams as {
    stockCategory?: "PF_G" | "PF_M";
    newActionJsonEncoded?: string;
  };
  if (newActionJsonEncoded) {
    const newAction = JSON.parse(newActionJsonEncoded) as Action;
    actions.push(newAction);
    console.log(newAction);
  }
  return (
    <RootView>
      <H2 className="mb-2">
        <Row className="w-full justify-between">
          <Text className="text-4xl">
            {capitalizeFirst(t("actions.newAction"))}
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
      </H2>
      <ScrollView>
        <ActionCreationTable data={actions} />
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
          <Button className="flex-1" onPress={handleSaveNewActions}>
            {capitalizeFirst(t("common.save"))}
          </Button>
        </Row>
      </ScrollView>
    </RootView>
  );
}
