import { Link, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { Plus } from "lucide-react-native";
import { View } from "react-native";
import { Eye } from "~/assets/images/icons/Eye";
import { Pencil } from "~/assets/images/icons/Pencil";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
  const { stockCategory = "PF_G" } = rawParams as {
    stockCategory?: "PF_G" | "PF_M";
  };
    return (
        <RootView>
            <View className="self-center">
                <H2 className="">
                    {capitalizeFirst(t("manage_pallet_sheet"))}
                </H2>
            </View>
            <View className="flex-1 align-center justify-center">
                <Row className="justify-center" gap={50}>
                    <Link
                    href={{
                        pathname : "/home/add_pallet_sheet",
                        params : {stockCategory : stockCategory}
                    }}>
                        <Button className="h-40 w-40" size={"lg"} icon={Plus}>
                            TEST
                        </Button>
                    </Link>
                    <Link
                    href={{
                        pathname : "/home/modify_pallet_sheet",
                        params : {stockCategory : stockCategory}
                    }}>
                        <Button className="h-40 w-40" size={"lg"} icon={Pencil}/>
                    </Link>
                    <Link
                    href={{
                        pathname : "/home/view_pallet_sheet",
                        params : {stockCategory : stockCategory}
                    }}>
                        <Button className="h-40 w-40" size={"lg"} icon={Eye}/>
                    </Link>
                </Row>
            </View>
        </RootView>
    );
}