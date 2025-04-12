import { useThemeColor } from "@/hooks/color/useThemeColor";
import { StyleSheet, View, type ViewProps } from "react-native";

type Props = ViewProps & {
    colors: string[],
    radius?: number,
    active?: boolean
}

export function ColorBall({ style, accessibilityViewIsModal, active = false, colors, radius = 40, ...rest }: Props) {
    const themeColors = useThemeColor()
    const borderColor = active ? themeColors.gray400 : themeColors.gray200
    return <View style={[style, styles.root]} {...rest}>
        <View style={[
            styles.ball,
            {
                width: radius,
                height: radius,
                backgroundColor: colors[0],
                borderRadius: radius,
                outline: `3px solid ${borderColor}`
            }
        ]} />
        <View style={[
            styles.ball,
            {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: radius,
                height: radius / 2,
                backgroundColor: colors[1],
                borderBottomEndRadius: radius,
                borderBottomStartRadius: radius,
            }
        ]} />
    </View>
}

const styles = StyleSheet.create({
    root: {
        margin: 3
    },
    ball: {
        // borderRadius:
    }
})