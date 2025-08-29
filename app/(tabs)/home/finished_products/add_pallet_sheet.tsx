import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { QrCodeIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { CreatePalletSheet } from "~/components/ui/create-pallet-sheet";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { H2 } from "~/components/ui/typography";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function add_pallet_sheet() {
    
    const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
    const {stockCategory = "PF_G"} = rawParams as {
        stockCategory? : "PF_G" | "PF_M"
    }
    const {height, width} = useWindowDimensions();
    const {rowNameWidth, rowsHeight} = {rowNameWidth : Math.round(width / 5) ,rowsHeight: Math.round(height / 12)};
    
    //Variable that stocks user selected value on droplists
    const [product_code_value, setProductCodeValue] = useState("");
    const [lot_number_value, setLotNumberValue] = useState("");
    
    let [newQRData, setNewQRData] = useState<number|undefined>(undefined);

    //Variable that stocks user's inputs in pallet sheet
    const [originInput, setOriginInput] = useState<string | undefined>(undefined);
    const [clientInput, setClientInput] = useState<string | undefined>(undefined);
    const [quantityInput, setQuantityInput] = useState<string | undefined>(undefined);


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

    //State depending constants
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

    const {mutate : createNewQR } = useFetchMutation(
        "/qr-code/",
        "post"
    );

    const handleNewQRCreation = () => {
        console.log("I'm pressed");
        createNewQR(
            {
                pathParams : {stock_category : stockCategory},
                body : {
                    product_code : completeData.product_code,
                    lot_number : completeData.lot_number,
                    quantity : Number(quantityInput),
                    expiration_date : completeData.expiration_date,
                }
            },
            {
                onSuccess : (data) => {
                    setNewQRData(data?.data?.id);
                },

                onError : (error) => {
                    console.log(error.message);
                } 
            }
        );
        //New qr_code creation  
    }

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
        } else if (!Array.isArray(completeData) && (!isLotNumberSelected || !isProductCodeSelected)) {
            setCompleteData([]);
        }
    }, [productCompleteData]);


    let isSelectingPC = false ; 
    let isSelectingLN = false ; 

    return (
        <RootView disableInsets={{left:true, top:true}}>
            <ScrollView>
                <H2 className="mb-2">
                    <Row className="w-full justify-between">
                        <Text className="text-4xl">
                            {capitalizeFirst(t("add_pallet_sheet.add_pallet_sheet"))}
                        </Text>
                        <Label className="text-2xl font-mono">
                            {capitalizeFirst(t("add_pallet_sheet.remains_to_be_placed")) + " : "}
                            <Text className="ml-[10] border-radius border">
                                {!Array.isArray(completeData) ? completeData?.quantity : capitalizeFirst(t("add_pallet_sheet.select_a_product"))}
                            </Text>
                        </Label>
                        <Tooltip>
                            <TooltipTrigger>
                                {<QrCodeIcon />}
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
                <View className="border-[3px] border-radius" >
                    <Row gap={10} className="border-b-[2px]">
                        <Text className={"text-[30px] border-r-[2px] text-center"} style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("actions.product_code").toUpperCase()}
                        </Text>
                        <Text className="font-extrabold text-[30px] text-center flex-1" style={{height: rowsHeight}}>
                            {completeData?.product_code ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10} className="border-b-[2px]">
                        <Text className={"text-[30px] border-r-[2px] text-center"} style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.origin").toUpperCase()}
                        </Text>
                        <TextInput editable={isLotNumberSelected} className="font-extrabold text-[30px] placeholder:text-gray-400 placeholder:opacity-70 text-center flex-1" placeholder="Origin (Ex : IGP)" style={{height: rowsHeight}} onChangeText={(text) => {text === "" ? setOriginInput(undefined) : setOriginInput(text);}}>

                        </TextInput>
                    </Row>
                    <Row gap={10} className="border-b-[2px]">
                        <Text className="border-r-[2px] text-[30px] text-center" style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.client").toUpperCase()}
                        </Text>
                        <TextInput editable={isLotNumberSelected} className="font-extrabold text-[30px] placeholder:text-gray-400 placeholder:opacity-70 text-center flex-1" placeholder="Client (Ex : AGRO)" onChangeText={(text) => {text === "" ? setClientInput(undefined) : setClientInput(text);}}>
                        
                        </TextInput>
                    </Row>
                    <Row gap={10} className="border-b-[2px]">
                        <Text className="border-r-[2px] text-[30px] text-center" style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.product").toUpperCase()}
                        </Text>
                        <Text className="font-extrabold text-[30px] text-center flex-1">
                            {completeData?.product_name ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10} className="border-b-[2px]">
                        <Text className="border-r-[2px] text-[30px] text-center" style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.lot_number").toUpperCase()}
                        </Text>
                        <Text className="font-extrabold text-[30px] text-center flex-1">
                            {completeData.lot_number ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10} className="border-b-[2px]">
                        <Text className="border-r-[2px] text-[30px] text-center" style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.expiration_date").toUpperCase()}
                        </Text>
                        <Text className="font-extrabold text-[30px] text-center flex-1">
                            {completeData.expiration_date ?? ""}
                        </Text>
                    </Row>
                    <Row gap={10}>
                        <Text className="border-r-[2px] text-[30px] text-center" style={{width : rowNameWidth, height : rowsHeight}}>
                            {t("add_pallet_sheet.quantity").toUpperCase()}
                        </Text>
                        <TextInput editable={isLotNumberSelected} className="font-extrabold text-[30px] placeholder:text-gray-400 placeholder:opacity-70 text-center flex-1" placeholder="Ex : 40" onChangeText={(text) => {text === "" ? setQuantityInput(undefined) : setQuantityInput(text);}}>
                            
                        </TextInput>
                    </Row>
                </View>
                <CreatePalletSheet className="mt-3" stockCategory={stockCategory} data={!Array.isArray(completeData) ? {...completeData,quantity : quantityInput ? Number(quantityInput) : undefined, client : clientInput, origin : originInput} : undefined}/>
            </ScrollView>
        </RootView>
    )
}
