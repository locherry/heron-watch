import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { IconSymbolName } from "@/constants/Icons";

type Props = ViewProps & {
    iconName: IconSymbolName,
    size?: number,
    backgroundColor?: string,
    onPress?: () => void,
}

export function BtnIcon({ style, iconName, backgroundColor, size = 20, onPress, ...rest }: Props) {
    const colors = useThemeColor()
    return <Pressable onPress={onPress} style={[{ backgroundColor: backgroundColor ?? colors.tint, height: size + 16, width: size + 16 }, style, styles.root]} {...rest}>
        <IconSymbol name={iconName} size={size} />
    </Pressable>
}

const styles = StyleSheet.create({
    root: {
        padding: 8,
        borderRadius: 8
    }
})