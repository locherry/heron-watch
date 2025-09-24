import { Apple, Table2, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";
export default function App() {
  const [t] = useTranslation();

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
