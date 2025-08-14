
import { t } from "i18next";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";

export default function App() {
  return (
    <RootView>
      <Button variant="outline">{t("Export to excel for Kooklin")}</Button>
      <Button variant="outline">{t("Import clients from JESAISPLUSCOMMENTQUELLESAPPELLELAPPLI")}</Button>
    </RootView>
  );
}
