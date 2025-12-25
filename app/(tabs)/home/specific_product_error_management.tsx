
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, LayoutChangeEvent, TextInput, useWindowDimensions, View } from "react-native";
import { StockCategory } from "~/@types/stock";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Text } from "~/components/ui/text";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";

export default function App() {
    const [t] = useTranslation();
    const specificProduct = useLocalSearchParams();
    const dimensions = useWindowDimensions();
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
    const [errorListDimension, setErrorListDimension] = useState<undefined | number>(undefined)
    const [errorsInput, setErrorsInput] = useState<{[id : number] : number}>({});
    //Array to stock all error's inputs
    useEffect(() => {
        setErrorsInput(previousState => {
            const newTab = {...previousState};
            for (let i = 0 ; i < (data?.data?.length ?? 0) ; i++) {
                if (data?.data) {
                    newTab[i] = data?.data[i]?.quantity ?? 0;      
                }
            }
            return newTab;
        })
    }, [data])
    const handleLayout = (nativeEvent : LayoutChangeEvent) => {
        setErrorListDimension(nativeEvent.nativeEvent.layout.width)
    }
    const renderItem = ({item, index} : {item : any, index : number}) => (
        <View
            className={cn(
            "flex-row justify-around p-2 items-center",
            index % 2 === 0 ? "bg-muted" : "bg-background",
            "dark:bg-muted-dark dark:odd:bg-background-dark"
            )}
            onLayout={handleLayout}>
                <Text>
                    {item.created_at}
                </Text>
                <Text>
                    {item.created_by_id}
                </Text>
                <TextInput
                    className="text-center text-xl"
                    defaultValue={errorsInput[index]?.toString()}
                    onChangeText={(text) => {
                        const newTab = {...errorsInput};
                        newTab[index] = Number(text);
                        setErrorsInput(previousState => newTab);
                    }}
                    inputMode="numeric"
                />

        </View>
    );
    console.log(lot_number);
    return (
        <RootView>
            <Header
            title = {capitalizeFirst(t("error_management_menu.resolve_error"))}
            className="mb4"
            />
            <View className="mr-20 ml-20">
                <Text variant={"h2"} className="flex justify-center">
                    {capitalizeFirst(t("error_management_menu.list_actions_wrong_product"))}
                </Text>
                <View>
                    <View className="flex-row justify-around items-center">
                        <Text variant={"h4"} className="p-2">
                            Creation date
                        </Text>
                        <Text variant={"h4"} className="p-2">
                            User
                        </Text>
                        <Text variant={"h4"} className="p-2">
                            Creation date
                        </Text>
                    </View>
                    <FlatList
                        data={data?.data}
                        keyExtractor={(row) => (row.id.toString())}
                        renderItem={renderItem}
                    />
                </View>
            </View>
            <View className="items-center mt-20">
                <Text variant={"h3"}>
                    A faire : val stock actuel
                </Text>
            </View>
        </RootView>
    );
}