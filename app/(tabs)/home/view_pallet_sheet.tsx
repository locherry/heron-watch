import { t } from "i18next";
import { FlatList } from "react-native-gesture-handler";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
    return (
        <RootView>
            <FlatList
                focusable = {false}
                data = {[]}
                keyExtractor={(_,i) => i.toString()}
                renderItem={null}
                ListHeaderComponent={
                    <>
                        <Header title={capitalizeFirst(t("view_pallet_sheet.view_pallet_sheet"))} className="mb-2"/>
                    </>
                }>

            </FlatList>
        </RootView>
    );
}