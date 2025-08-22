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
    const [product_code_value, setProductCodeValue] = useState("");
    const [lot_number_value, setLotNumberValue] = useState("");

    //variable that allowed other droplists to be used
    let { data, error, isLoading, isError } = useFetchQuery(
        "/stocks/{stock_category}",
        "get",
        {
            path: { stock_category: stockCategory },
            query:
            product_code_value === "" && lot_number_value === ""
                ? { distinct : true, required_elts: ["product_code"] }
                : product_code_value !== "" && lot_number_value === ""
                ? { distinct : true, required_elts: ["lot_number"], filter_params: { product_code: product_code_value } }
                : { distinct : true, filter_params: { product_code: product_code_value!, lot_number: lot_number_value! } }
        }
    );
    const [filteredData, setFilteredData] = useState(data?.data ?? [])
    const [dynamic_product_code_value, setDynamicProductCodeValue] = useState("");
    const [dynamic_lot_number_value, setDynamicLotNumberValue] = useState("");
    const [isProductCodeSelected,setIsProductCodeSelected] = useState(false);
    const [isLotNumberSelected,setIsLotNumberSelected] = useState(false);
    const [isProductCodeFocus, setIsProductCodeFocus] = useState(false);
    const [isLotNumberFocus, setIsLotNumberFocus] = useState(false);

    

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
            <Row className="w-full justify-between mb-2 z-20"> 
                <Label className="text-base">
                    {capitalizeFirst(t("actions.product_code"))}
                </Label>
                <Autocomplete
                    className="w-full"
                    hideResults={isProductCodeFocus}
                    onBlur={() => {setTimeout(() => {!isProductCodeFocus ? setIsProductCodeFocus(true) : undefined},100)}}
                    onFocus={() => {isProductCodeFocus ? setIsProductCodeFocus(false) : undefined}}
                    data={filteredData}
                    defaultValue ={""}
                    value={dynamic_product_code_value}
                    onChangeText={(text) => {
                        setProductCodeValue("");
                        setDynamicProductCodeValue(text) ;
                        isProductCodeSelected ? setIsProductCodeSelected(false) : undefined ;
                        if (data !== undefined && data.data !== undefined) {
                            let filteredResult = data?.data?.filter((line) => line.product_code.includes(text))
                            setFilteredData(filteredResult)
                        }
                    }}
                    flatListProps={{
                        keyExtractor : (item) => item.product_code,
                        renderItem : ({item}) => (
                            <ScrollView>
                                <TouchableOpacity
                                    className= {item.id % 2 ? "flex-row bg-muted" : "flex-row bg-background" }
                                    onPress={() => {
                                        setProductCodeValue(item.product_code);
                                        setIsProductCodeSelected(true);
                                        setDynamicProductCodeValue(item.product_code);
                                        setIsProductCodeFocus(true);
                                    }}
                                    >
                                    <Text>
                                        {item.product_code}
                                    </Text>
                                </TouchableOpacity>
                           </ScrollView>
                        ),
                    }}
                />
            </Row>
            <Row className="w-full justify-between mb-2 z-10">
                <Label className="text-base">
                    {capitalizeFirst(t("actions.lot_number"))}
                </Label>
                <Autocomplete
                    hideResults={isLotNumberFocus}
                    onBlur={() => {setTimeout(() => {!isLotNumberFocus ? setIsLotNumberFocus(true) : undefined},100)}}
                    onFocus={() => {isLotNumberFocus ? setIsLotNumberFocus(false) : undefined}}
                    editable={isProductCodeSelected}
                    data={filteredData}
                    defaultValue ={""}
                    value={dynamic_lot_number_value}
                    onChangeText={(text) => {
                        setLotNumberValue("");
                        setDynamicLotNumberValue(text) ;
                        setIsLotNumberSelected(false);
                        if (data !== undefined && data.data !== undefined) {
                            let filteredResult = data?.data?.filter((line) => line.lot_number.includes(text))
                            setFilteredData(filteredResult)
                        }
                    }}
                    flatListProps={{
                        keyExtractor : (item) => item.lot_number,
                        renderItem : ({item}) => (
                            <ScrollView>
                                <TouchableOpacity
                                    className= {item.id % 2 ? "flex-row bg-muted" : "flex-row bg-background" }
                                    onPress={() => {
                                        setLotNumberValue(item.lot_number);
                                        setIsLotNumberSelected(true);
                                        setDynamicLotNumberValue(item.lot_number);
                                    }}>
                                    <Text>
                                        {item.lot_number}
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