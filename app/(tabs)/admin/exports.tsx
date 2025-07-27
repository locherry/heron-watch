
import { t } from "i18next";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  return (
    <RootView>
      <H2>{capitalizeFirst(t("common.exports"))}</H2>
      <Button variant="outline">{t("Export to excel for Kooklin")}</Button>
      <Button variant="outline">{t("Import clients from JESAISPLUSCOMMENTQUELLESAPPELLELAPPLI")}</Button>
    </RootView>
  );
}
