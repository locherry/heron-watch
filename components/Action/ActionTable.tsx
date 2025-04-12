import { StyleSheet, View, type ViewProps } from "react-native";
import { Row } from "../ui/Row";
import { ThemedText } from "../Themed/ThemedText";
import { ActionTableHeader } from "./ActionTableHeader";
import { ActionTableEntry } from "./ActionTableEntry";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";

export type ActionType = {
    name: string,
    productName: string,
    quantity: number,
    userName: string,
    date: Date
}

type Props = ViewProps & {
    actions: ActionType[]
}

export function ActionTable({ style, actions }: Props) {
    return <View style={[styles.root, style]}>
        <ActionTableHeader />
        <ScrollView>
            <FlatList
                data={actions}
                renderItem={({ item }) => <ActionTableEntry action={item} />}
            />
        </ScrollView>
    </View>

}

const styles = StyleSheet.create({
    root: {
        //     width:"100%"
    }
})