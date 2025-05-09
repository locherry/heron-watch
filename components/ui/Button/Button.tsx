import { ThemedText } from "@/components/Themed/ThemedText";
import { IconSymbolName } from "@/constants/Icons";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Pressable, StyleProp, StyleSheet, ViewStyle, type ViewProps } from "react-native";
import { Column } from "../../layout/Column";
import { Row } from "../../layout/Row";
import { IconSymbol } from "../Icon/IconSymbol";

const typeType = ['default', 'primary', 'danger']

type Props = ViewProps & {
    onPress: () => void,
    iconName?: IconSymbolName,
    iconColor?: string,
    iconSize?: number,
    text?: string,
    type?: typeof typeType[number],
    direction?: 'column' | 'row',
    disabled?: boolean
}

export function Button({ style, onPress, iconName, iconColor, iconSize, text, children, direction = 'row', type = 'default', disabled = false, ...rest }: Props) {
    const colors = useThemeColor()
    const typeStyle = {
        'default': {
            backgroundColor: colors.gray300,
        },
        'primary': {
            backgroundColor: colors.tint,
        },
        'danger': {
            backgroundColor: colors.danger,
        },
        'success': {
            backgroundColor: colors.success,
        },
        'info': {
            backgroundColor: colors.info,
        },
        'warning': {
            backgroundColor: colors.warning,
        }
    } as Record<typeof typeType[number], StyleProp<ViewStyle>>

    const Direction = direction == 'row' ? Row : Column

    return <Pressable
        onPress={!disabled ? onPress : null}
        
        style={[
            typeStyle[type],
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
