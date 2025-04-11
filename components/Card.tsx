import { Shadows } from "@/constants/Shadows";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps

export function Card({ style, ...rest }: Props) {
    const colors = useThemeColor()
    return <View style={[
        styles,
        { backgroundColor: colors.background },
        style,
    ]} {...rest} />
}

const styles = {
    borderRadius: 8,
    overflow: "hidden",
    ...Shadows.dp2,

} satisfies ViewStyle