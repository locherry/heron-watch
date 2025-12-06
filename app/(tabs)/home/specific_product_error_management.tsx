
import { useTranslation } from "react-i18next";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
    const [t] = useTranslation();
    return (
        <RootView>
            <Header
            title = {capitalizeFirst(t("error_management_menu.resolve_error"))}
            className="mb4"
            />
        </RootView>
    );
}