import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Keyboard, TouchableOpacity, useWindowDimensions } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { FlatList } from "react-native-gesture-handler";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
    const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
    const { stockCategory = "PF_G" } = rawParams as {
        stockCategory?: "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";
    };

    const [product_code_value, setProductCodeValue] = useState("");
    const [lot_number_value, setLotNumberValue] = useState("");  
    const [dynamic_product_code_value, setDynamicProductCodeValue] = useState("");
    const [dynamic_lot_number_value, setDynamicLotNumberValue] = useState("");

    const {data : PCData, error : PCError, isLoading : PCIsLoading, isError : PCIsError} = useFetchQuery(
        "/stocks/{stock_category}",
        "get",
        {
            path : {stock_category : stockCategory},
            query : lot_number_value !== "" ?
                {
                    required_elts : ["product_code"],
                    distinct : true,
                    filter_params : {
                        lot_number : lot_number_value
                    }
                } : {
                required_elts : ["product_code"],
                distinct : true
                }
        }
    )

    const { height, width } = useWindowDimensions();
    const { rowNameWidth, rowsHeight } = {
        rowNameWidth: Math.round(width / 5),
        rowsHeight: Math.round(height / 12),
    };
    const [isProductCodeFocus, setIsProductCodeFocus] = useState(true);
    const [isLotNumberFocus, setIsLotNumberFocus] = useState(true);
    const [PCfilteredData, setPCFilteredData] = useState(PCData?.data ?? []);

    useEffect(() => {
        if (PCData !== undefined && PCData.data !== undefined) {
        let filteredResult = PCData?.data?.filter((line) =>
            line.product_code.includes(dynamic_product_code_value)
        );
        setPCFilteredData(filteredResult);
        }
    }, [dynamic_product_code_value]);

    let isSelectingPC = false;
    let isSelectingLN = false;
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
                        <Label className="text-base">
                            {capitalizeFirst(t("actions.product_code"))}
                        </Label>
                        <Autocomplete
                            inputContainerStyle={{ borderWidth: 0 }} // remove default border
                            containerStyle={{ width: width / 5 }}
                            hideResults={isProductCodeFocus}
                            onBlur={() => {
                            setTimeout(() => {
                                Keyboard.dismiss();
                                if (!isProductCodeFocus && !isSelectingPC) {
                                setIsProductCodeFocus(true);
                                } else {
                                isSelectingPC = false;
                                }
                            }, 100);
                            }}
                            onFocus={() => {
                            setIsProductCodeFocus(false);
                            }}
                            data={!isProductCodeFocus ? PCfilteredData : []}
                            value={dynamic_product_code_value}
                            onChangeText={(text) => {
                                setDynamicProductCodeValue(text);
                            }}
                            renderTextInput={(props) => (
                            <Input {...props} placeholder={t("actions.product_code")} />
                            )}
                            flatListProps={{
                            keyExtractor: (item) => item.product_code,
                            renderItem: ({ item }) => (
                                <TouchableOpacity
                                className="flex-row justify-center border border-black dark:border-white bg-white dark:bg-black"
                                onPressIn={() => (isSelectingPC = true)}
                                onPress={() => {
                                    setProductCodeValue(item.product_code);
                                    setDynamicProductCodeValue(item.product_code);
                                    setIsProductCodeFocus(true);
                                }}
                                >
                                <Text className="text-black dark:text-white">
                                    {item.product_code}
                                </Text>
                                </TouchableOpacity>
                            ),
                            }}
                        />
                    </>
                }>

            </FlatList>
        </RootView>
    );
}