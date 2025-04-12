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
    return <View style={[styles.root, { flex: 1 }, style]}>
        <ActionTableHeader />
        <FlatList
            data={actions}
            renderItem={({ item }) => <ActionTableEntry action={item} />}
            style={{ flex: 1 }}  // Required for web scrolling
            contentContainerStyle={{ minHeight: '100%' }} // Web-specific fix
            scrollEnabled={true}
            nestedScrollEnabled={true} // Enable nested scrolling
        />
    </View>
}

const styles = StyleSheet.create({
    root: {
        // paddingBlockEnd: 200
    }
})