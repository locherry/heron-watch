import { t } from "i18next";
import { Apple } from "~/assets/images/icons/Apple";
import { Table2 } from "~/assets/images/icons/Table2";
import { User } from "~/assets/images/icons/User";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";
export default function App() {
  return (
    <RootView>
      <Text variant="h2">{capitalizeFirst(t("admin.tabName"))}</Text>
      <SettingsEntry
        href={"/admin/users"}
        icon={User}
        title={capitalizeFirst(t("admin.users.name"))}
      />
      <SettingsEntry
        href={"/admin/products"}
        icon={Apple}
        title={capitalizeFirst(t("admin.product_category.name"))}
      />
      <SettingsEntry
        href={"/admin/exports"}
        icon={Table2}
        title={capitalizeFirst(t("admin.exports.name"))}
      />
    </RootView>
  );
}
