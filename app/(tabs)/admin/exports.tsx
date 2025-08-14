
import { t } from "i18next";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";

export default function App() {
  return (
    <RootView>
      <Header title={t("Export")}/>
      <Button variant="outline">{t("Export to excel for Kooklin")}</Button>
      <Button variant="outline">{t("Import clients from JESAISPLUSCOMMENTQUELLESAPPELLELAPPLI")}</Button>
    </RootView>
  );
}
