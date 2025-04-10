import { StyleSheet, View, type ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemedText } from "../Themed/ThemedText";

export type ActionType = {
    name: string,
    productName: string,
    quantity: number,
    userName: string,
    date: Date
}

type Props = ViewProps & {
}

export function ActionTableHeader({ style, ...rest }: Props) {
    return <Row style={[style, styles.root]} {...rest}>
        <ThemedText style={styles.colName}>Action</ThemedText>
        <ThemedText style={styles.colQuantity}>#</ThemedText>
        <ThemedText style={styles.colName}>User</ThemedText>
        <ThemedText style={styles.colDate}>Date</ThemedText>
        <ThemedText style={styles.colActions}>Actions</ThemedText>
    </Row>
}

const styles = StyleSheet.create({
    root: {},
    colName: {
        width: 50
    },
    colDate: {
        width: 100
    },
    colQuantity: {
        width: 14
    },
    colActions:{
        width: 40
    }
})