import { t } from "i18next";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { H2 } from "~/components/ui/typography";
import { Table2 } from "~/lib/icons/Table2";
import { User } from "~/lib/icons/User";
import { capitalizeFirst } from "~/lib/utils";
export default function App() {
  return (
    <RootView>
      <H2>{capitalizeFirst(t("admin.tabName"))}</H2>
      <SettingsEntry
        href={"/admin/users"}
        icon={User}
        title={capitalizeFirst(t("admin.users.name"))}
      />
      <SettingsEntry
        href={"/admin/exports"}
        icon={Table2}
        title={capitalizeFirst(t("admin.exports.name"))}
      />
    </RootView>
  );
}
