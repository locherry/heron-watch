import { useThemeColor } from "@/hooks/color/useThemeColor";
import { useClosestMedia } from "@/hooks/useClosestMedia";
import { StatusBar, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = ViewProps & {
    color?: string
}
export function RootView({ style, color, ...rest }: Props) {
    const colors = useThemeColor()
    const padding = {
        '2xl': 400,
        'xl': 300,
        'lg': 200,
        'md': 100,
        'sm': 8
    }
    const media = useClosestMedia() as keyof typeof padding
    const mediaStyles = {
        // paddingHorizontal: ['md', 'lg'].includes(media) ? 200 : ['xl', '2xl'].includes(media) ? 400 : 8
        paddingHorizontal: padding[media]
    } satisfies ViewStyle

    return <>
        <StatusBar
            animated={true}
            backgroundColor={color ?? colors.tint}
            // barStyle={'default'}
            // showHideTransition={true}
            hidden={false} />
        <SafeAreaView style={[
            mediaStyles,
            styles.container,
            { backgroundColor: color ?? colors.tint },
            style,
        ]} {...rest}>
        </SafeAreaView>
    </>
}



const styles = StyleSheet.create({
    container: {
        padding: 4,
        flex: 1,
    }
})