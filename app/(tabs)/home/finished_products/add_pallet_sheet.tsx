import { Label } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { QrCode } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
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
    const {height, width} = useWindowDimensions();
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
    const [completeData, setCompleteData] = useState<any>([]);

    let {data : productCompleteData = [], isLoading : newDataLoading = false, error : newDataError} = useFetchQuery(
        "/stocks_join_product_category/{stock_category}",
        "get",
        {
            path : {stock_category : stockCategory},
            query : {filter_params : {product_code : product_code_value, lot_number : lot_number_value}} 
        },
        undefined, 
        isProductCodeSelected && isLotNumberSelected,
    );

    useEffect(() => {
        if (!isProductCodeSelected && !isLotNumberSelected) {
            if (data !== undefined && data.data !== undefined) {
                let filteredResult = data?.data?.filter((line) => line.product_code.includes(dynamic_product_code_value))
                setFilteredData(filteredResult)
            }
        }
    }, [dynamic_product_code_value]);

    useEffect(() => {
        if (!isLotNumberSelected && isProductCodeSelected) {
            if (data !== undefined && data.data !== undefined) {
                let filteredResult = data?.data?.filter((line) => line.lot_number.includes(dynamic_lot_number_value));
                setFilteredData(filteredResult);
            } 
        } 
    }, [dynamic_lot_number_value]);

    useEffect(() => {
        if (productCompleteData && !Array.isArray(productCompleteData)) {
            setCompleteData(productCompleteData?.data?.[0]);
        }
    }, [productCompleteData]);


    let isSelectingPC = false ; 
    let isSelectingLN = false ; 

    console.log(product_code_value);
    console.log(lot_number_value);

    console.log(newDataError);
    console.log(completeData);

    return (
        <RootView disableInsets={{left:true, top:true}}>
            <SafeAreaView>
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
                        containerStyle ={{width : width / 5}}
                        hideResults={isProductCodeFocus}
                        onBlur={() => {
                                Keyboard.dismiss();
                                setTimeout( () => {
                                    if (!isProductCodeFocus && !isSelectingPC) {
                                        setIsProductCodeFocus(true);
                                    } else {
                                        isSelectingPC = false;
                                    }},
                                    100
                                ) ; 
                            }
                        }
                        onFocus={() => {
                            setIsProductCodeFocus(false)
                        }}
                        data={!isProductCodeFocus ? filteredData : []}
                        value={dynamic_product_code_value}
                        onChangeText={(text) => {
                            if (product_code_value !== "") {
                                if (lot_number_value !== "") {
                                    setLotNumberValue("");
                                    setIsLotNumberSelected(false);
                                }
                                setProductCodeValue("");
                                setDynamicLotNumberValue('');
                            }
                            setDynamicProductCodeValue(text) ;
                            setIsProductCodeSelected(false);
                        }}
                        flatListProps={{
                            keyExtractor : (item) => item.product_code,
                            renderItem : ({item}) => (
                                <TouchableOpacity
                                    className= {"flex-row bg-muted justify-center"}
                                    onPressIn={() => isSelectingPC = true}
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
                            ),
                            
                        }}
                    />
                </Row>
                <Row className="w-full justify-between mb-2 z-10">
                    <Label className="text-base">
                        {capitalizeFirst(t("actions.lot_number"))}
                    </Label>
                    <Autocomplete
                        containerStyle={{width : width / 5}}
                        hideResults={isLotNumberFocus}
                        onBlur={() => {
                                Keyboard.dismiss();
                                setTimeout( () => {
                                    if (!isLotNumberFocus && !isSelectingLN) {
                                        setIsLotNumberFocus(true);
                                    } else {
                                        isSelectingLN = false;
                                    }},
                                    100
                                ) ; 
                            }
                        }
                        onFocus={() => {
                            if(isLotNumberFocus) {
                                setIsLotNumberFocus(false) 
                            }}
                        }
                        editable={isProductCodeSelected}
                        data={!isLotNumberFocus ? filteredData : []}
                        value={dynamic_lot_number_value}
                        onChangeText={(text) => {
                            if (lot_number_value !== "") {
                                setLotNumberValue("");
                                setIsLotNumberSelected(false);
                            }
                            setDynamicLotNumberValue(text);
                        }}
                        flatListProps={{
                            keyExtractor : (item) => item.lot_number,
                            renderItem : ({item}) => (
                                <TouchableOpacity
                                    className= {"flex-row bg-muted justify-center"}
                                    onPressIn={() => isSelectingLN = true}
                                    onPress={() => {
                                        setLotNumberValue(item.lot_number);
                                        setIsLotNumberSelected(true);
                                        setDynamicLotNumberValue(item.lot_number);
                                        setIsLotNumberFocus(true);
                                    }}
                                    >    
                                    <Text>
                                        {item.lot_number}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </Row>
                <View className="grid border-[3px] border-radius">
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px]">
                            {t("actions.product_code").toUpperCase()}
                        </Text>
                        <Text className=" justify-center ">
                            {completeData?.product_code ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.origin").toUpperCase()}
                        </Text>
                        <TextInput className="" placeholder="Origin (Ex : IGP)">

                        </TextInput>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.client").toUpperCase()}
                        </Text>
                        <TextInput className="" placeholder="Client (Ex : AGRO)">
                        
                        </TextInput>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.product").toUpperCase()}
                        </Text>
                        <Text className="">
                            {completeData?.product_name ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.lot_number").toUpperCase()}
                        </Text>
                        <Text className="">
                            {completeData.lot_number ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] border-b-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.expiration_date").toUpperCase()}
                        </Text>
                        <Text className="">
                            {completeData.expiration_date ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] text-[30px] justify-center">
                            {t("add_pallet_sheet.quantity").toUpperCase()}
                        </Text>
                        <TextInput className="" placeholder="Ex : 40">
                            
                        </TextInput>
                    </Row>
                </View>
            </SafeAreaView>
        </RootView>
    )
}