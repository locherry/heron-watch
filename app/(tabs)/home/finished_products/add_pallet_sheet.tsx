import { Label } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { QrCode } from "lucide-react-native";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Text } from "~/components/ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { H2 } from "~/components/ui/typography";
import { capitalizeFirst } from "~/lib/utils";
export default function add_pallet_sheet() {
    const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
    const {stockCategory = "PF-G"} = rawParams as {
        stockCategory? : "PF-G" | "PF-M"
    }

    const {product_code_value, lot_number_value} = {product_code_value : null, lot_number_value : null} as {
        product_code_value : null|string, lot_number_value : null|string
    };

    // const {data, error, isLoading, isError} = useFetchQuery(
    //     url: "/stocks/"
    // )

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
                {/* <Autocomplete

                
                
                /> */}
            </Row>
        </RootView>
    )
}