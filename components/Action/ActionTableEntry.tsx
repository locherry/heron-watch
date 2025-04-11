import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemedText } from "../Themed/ThemedText";
import { BtnIcon } from "../ui/BtnIcon";
import { useThemeColor } from "@/hooks/color/useThemeColor";

export type ActionType = {
    name: string,
    productName: string,
    quantity: number,
    userName: string,
    date: Date
}

type Props = ViewProps & {
    action: ActionType
}

export function ActionTableEntry({ style, action, ...rest }: Props) {
    const colors = useThemeColor()
    return <Row style={[style, styles.root]} gap={8} {...rest}>
        <ThemedText style={styles.colName}>{action.name}</ThemedText>
        <ThemedText style={styles.colQuantity}>{action.quantity}</ThemedText>
        <ThemedText style={styles.colName}>{action.userName}</ThemedText>
        <ThemedText style={styles.colDate}>{action.date.toDateString()}</ThemedText>
        <Row style={styles.colActions}>
            <BtnIcon iconName="pencil" size={18}/>
            <BtnIcon iconName="trash" backgroundColor={colors.danger} size={18} />
            <BtnIcon iconName="ellipsis" backgroundColor={colors.light} size={18} />
        </Row>
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
    colActions: {
        width: 100
    }
})