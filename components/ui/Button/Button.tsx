import { IconSymbolName } from "@/constants/Icons";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle, type ViewProps } from "react-native";
import { IconSymbol } from "../IconSymbol";
import { ThemedText } from "@/components/Themed/ThemedText";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Row } from "../Row";
import { Column } from "../Column";

const variantType = ['default', 'primary', 'danger']

type Props = ViewProps & {
    onPress: () => void,
    iconName?: IconSymbolName,
    iconColor?: string,
    iconSize?: number,
    text?: string,
    variant?: typeof variantType[number],
    direction?: 'column' | 'row',
    disabled?: boolean
}

export function Button({ style, onPress, iconName, iconColor, iconSize, text, children, direction = 'row', variant = 'default', disabled = false, ...rest }: Props) {
    const colors = useThemeColor()
    const variantStyle = {
        'default': {
            backgroundColor: colors.gray300,
        },
        'primary': {
            backgroundColor: colors.tint,
        },
        'danger': {
            backgroundColor: colors.danger,
        }
    } as Record<typeof variantType[number], StyleProp<ViewStyle>>

    const Direction = direction == 'row' ? Row : Column

    return <Pressable
        onPress={!disabled ? onPress : null}
        
        style={[
            variantStyle[variant],
            { cursor: !disabled ? 'pointer' : 'auto' },
            { opacity: !disabled ? 1 : .7 },
            styles.root,
            style]} {...rest}>
        <Direction gap={8}>
            {iconName && <IconSymbol name={iconName} color={iconColor} size={iconSize} />}
            {text && <ThemedText>{text}</ThemedText>}
            {children}
        </Direction>
    </Pressable>
}
const styles = StyleSheet.create({
    root: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        // margin: 16
    }
})
