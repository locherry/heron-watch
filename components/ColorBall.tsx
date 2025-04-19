import { useThemeColor } from "@/hooks/color/useThemeColor";
import { StyleSheet, View, type ViewProps } from "react-native";

type Props = ViewProps & {
    colors: string[],
    radius?: number,
    active?: boolean
}

export function ColorBall({ style, accessibilityViewIsModal, active = false, colors, radius = 40, ...rest }: Props) {
    const themeColors = useThemeColor()
    const borderColor = active ? themeColors.gray500 : themeColors.gray200
    return <View style={[style, styles.root]} {...rest}>
        {/* background disk color */}
        <View style={[
            styles.ball,
            {
                width: radius,
                height: radius,
                backgroundColor: colors[0],
                borderRadius: radius,
                // outline: `3px solid ${borderColor}`
            }
        ]} />

        {/* foreground half-disk color */}
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
        
        {/* border backgound (with other view elements because "outline" property not supported on android) */}
        <View style={[
            styles.ball,
            {
                position: 'absolute',
                inset:0,
                width: radius,
                height: radius,
                backgroundColor: borderColor,
                borderRadius: radius,
                transform:"scale(1.15)",
                zIndex:-1
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