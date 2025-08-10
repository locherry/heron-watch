import { router } from "expo-router";
import { t } from "i18next";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { Plus } from "~/lib/icons/Plus";
import { useApiMutation } from "~/lib/useApiMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function NewActions() {
  const { mutate: createNewActions } = useApiMutation(
    "/actions/{stock_category}",
    "post"
  )
  const handleSaveNewActions = ()=>{}
  const handleNewAction = ()=>{
    router.push("/home/finished_products/new_action")
  }
  const handleCancel = ()=>{
    router.back()
  }
  return (
    <RootView>
      <H2>{capitalizeFirst(t("actions.newAction"))}</H2>
      {/* <ActionHistoryTable data={null} /> */}
      <Button className="mb-4" variant={"outline"} icon={Plus} onPress={handleNewAction}>
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
    </RootView>
  )
}
