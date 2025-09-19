import { Cylinder, Forklift, ScanBarcode } from "lucide-react-native";
import Row from "~/components/layout/Row";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

function PalletCard ({objId, objQuantity, ...props} : {objId : number, objQuantity : number}) {
    return (
        <Card className="max-w-[200] py-1">
            <CardHeader className="rounded-b border-gray-500 shadow-sm bg-white">
                <Row gap={10} className="justify-end items-center">
                    <ScanBarcode/>
                    <Text className="">
                        {objId}
                    </Text>
                </Row>
            </CardHeader>
            <CardContent>
                <Row className="justify-center" gap={30}>
                    <Cylinder size={64}/>
                    <Text className="font-bold text-[30px]">
                        {objQuantity}
                    </Text>
                </Row>
            </CardContent>
            <CardFooter className="justify-center ">
                <Forklift/>
            </CardFooter>
        </Card>
    );
}


export { PalletCard };
