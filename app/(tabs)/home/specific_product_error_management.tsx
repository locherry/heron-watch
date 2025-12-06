
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
    const [t] = useTranslation();
    const specificProduct = useLocalSearchParams();
    const {product_code, lot_number, stock_category} = specificProduct as {product_code : string, lot_number : string, stock_category : StockCategory};
    const {data, isLoading, isError} = useFetchQuery(
        "/actions/{stock_category}",
        "get", 
        {
            path : {stock_category : stock_category},
            query : {
                filter_params : {product_code : product_code, lot_number : lot_number}
            }
        }
    );
    return (
        <RootView>
            <Header
            title = {capitalizeFirst(t("error_management_menu.resolve_error"))}
            className="mb4"
            />
        </RootView>
    );
}