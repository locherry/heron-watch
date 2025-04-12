import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Row } from "../ui/Row";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "../ui/IconSymbol";
import { useState } from "react";
import { IconSymbolName } from "@/constants/Icons";

const dict = {
    danger: "xmark.circle.fill",
    info: "info.circle.fill",
    success: "checkmark.circle.fill",
    warning: "exclamationmark.circle.fill",
    light: "circle.fill",
    dark: "circle.fill",
} as Record<keyof typeof Colors["light"], IconSymbolName>

type Props = ViewProps & {
    type: keyof typeof dict
}

export function Alert({ style, type, children, ...rest }: Props) {
    const colors = useThemeColor()
    const [visible, setVisible] = useState(true)
    const textLightStyles = type == 'dark' ? {
        color : colors.gray100
    }: {}
    const iconLightStyles = type == 'dark' ? {
        backgroundColor: "rgba(0,0,0,.2)",
    }: {}
    const iconColor = type == 'dark' ? colors.gray100 : undefined

    return <Row gap={8} style={[
        style,
        styles.root,
        {
            backgroundColor: colors[type],
            display: visible ? "flex" : "none"
        }
    ]} {...rest}>
        <IconSymbol name={dict[type]} color={iconColor}/>
        <ThemedText style={[styles.text, textLightStyles]}>{children}</ThemedText>
        <Pressable style={[styles.discard, iconLightStyles]} onPress={() => { setVisible(!visible) }}>
            <IconSymbol name="trash" color={iconColor}/>
        </Pressable>
    </Row>
}

const styles = StyleSheet.create({
    root: {
        padding: 4,
        borderRadius: 4,
        marginBottom: 8
    },
    discard: {
        alignSelf: "flex-end",
        backgroundColor: "rgba(255,255,255,.2)",
        borderRadius: 4
    },
    text: {
        flex: 1
    }
})