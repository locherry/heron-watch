import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { CSSProperties } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

const styles = StyleSheet.create({
    h1: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold"
    },
    h2: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "bold"
    },
    h3: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "bold"
    },
    h4: {
        fontSize: 12,
        lineHeight: 24,
        fontWeight: "bold"
    },
    body: {
        fontSize: 12,
        lineHeight: 16
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16
    },
    link: {
        fontSize: 12,
        lineHeight: 16,
        textDecorationLine: "underline"
    }
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors["light"] & keyof typeof Colors["dark"],
    align?:'center'|'left'|'right'|'justify'
}

export function ThemedText({ variant,align, color, style, ...rest }: Props) {
    const colors = useThemeColor();
    return <Text style={[
        styles[variant ?? "body"], 
        { 
            color: colors[color ?? "text"],
            textAlign : align??undefined
        }, 
        style]} {...rest}></Text>
}