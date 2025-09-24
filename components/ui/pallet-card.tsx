import { Cylinder, Forklift, ScanBarcode } from "lucide-react-native";
import Row from "~/components/layout/Row";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Icon } from "./icon";
import { Separator } from "./separator";

function PalletCard({
  objId,
  objQuantity,
  ...props
}: {
  objId: number;
  objQuantity: number;
}) {
  return (
    <Card className="max-w-[200] py-1 mb-2 gap-1">
      <CardHeader className="flex-row justify-end items-center">
        <Icon as={ScanBarcode} />
        <Text>{objId}</Text>
      </CardHeader>
      <Separator/>
      <CardContent>
        <Row className="justify-center" gap={30}>
          <Icon as={Cylinder} size={64} />
          <Text className="font-bold text-[30px]">{objQuantity}</Text>
        </Row>
      </CardContent>
      <CardFooter className="justify-center ">
        <Icon as={Forklift} />
      </CardFooter>
    </Card>
  );
}

export { PalletCard };
