import { Label } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { QrCode } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { ScrollView } from "react-native-gesture-handler";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Text } from "~/components/ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { H2 } from "~/components/ui/typography";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";
export default function add_pallet_sheet() {
    const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
    const {stockCategory = "PF_G"} = rawParams as {
        stockCategory? : "PF_G" | "PF_M"
    }

    //Variable that stocks user selected value on droplists
    let {product_code_value, lot_number_value} = {product_code_value : null, lot_number_value : null} as {
        product_code_value : null|string, lot_number_value : null|string
    };
    
    //variable that allowed other droplists to be used
    let {isProductCodeSelected, isLotNumberSelected} = {isProductCodeSelected : false, isLotNumberSelected : false} as {isProductCodeSelected : boolean,isLotNumberSelected : boolean};
    let { data, error, isLoading, isError } = useFetchQuery(
        "/stocks/{stock_category}",
        "get",
        {
            path: { stock_category: stockCategory },
            query:
            product_code_value === null && lot_number_value === null
                ? { distinct : true, required_elts: ['id', "product_code"] }
                : product_code_value !== null && lot_number_value === null
                ? { distinct : true, required_elts: ['id', "lot_number"], filter_params: { product_code: product_code_value } }
                : { distinct : true, filter_params: { product_code: product_code_value!, lot_number: lot_number_value! } }
        }
    );
    
    const [filteredData, setFilteredData] = useState(data?.data ?? [])

    console.log(data?.data);
    return (
        <RootView disableInsets={{left:true, top:true}}>
            <H2 className="mb-2">
                <Row className="w-full justify-between">
                    <Text className="text-4xl">
                        {capitalizeFirst(t("add_pallet_sheet.add_pallet_sheet"))}
                    </Text>
                    <Tooltip>
                        <TooltipTrigger>
                            {<QrCode />}
                        </TooltipTrigger>
                        <TooltipContent>
                            <Text>
                                {capitalizeFirst(t("add_pallet_sheet.modify_existing_pallet_sheet"))}
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </Row>
            </H2>
            <Row className="w-full justify-between">
                <Label className="text-base">
                    {capitalizeFirst(t("actions.product_code"))}
                </Label>
                <Autocomplete
                    data={filteredData}
                    defaultValue ={""}
                    onChangeText={(text) => {
                        product_code_value = null;
                        isProductCodeSelected = false;
                        if (data !== undefined && data.data !== undefined) {
                            let filteredResult = data?.data?.filter((line) => line.product_code.includes(text))
                            setFilteredData(filteredResult)
                        }
                    }}
                    flatListProps={{
                        keyExtractor : (item) => item.id.toString(),
                        renderItem : ({item}) => (
                            <ScrollView>
                                <TouchableOpacity
                                    className= {item.id % 2 ? "flex-row bg-muted" : "flex-row bg-background" }
                                    onPress={() => {
                                        product_code_value = item.product_code;
                                        isProductCodeSelected = true;
                                        
                                    }}>
                                    <Text>
                                        {item.product_code}
                                    </Text>
                                </TouchableOpacity>
                           </ScrollView>
                        )
                    }}
 
                
                />
            </Row>
        </RootView>
    )
}