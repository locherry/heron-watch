import { t } from "i18next";
import RootView from "~/components/layout/RootView";
import { H2, P } from "~/components/ui/typography";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  return (
    <RootView>
      <H2>{capitalizeFirst(t("common.users"))}</H2>
      <P>A table of users ...</P>
    </RootView>
  );
}
