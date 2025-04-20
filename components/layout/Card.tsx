import { useThemeColor } from "@/hooks/color/useThemeColor";
import { View, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps & {
    backgroundColor? : string
}

export function Card({ style, backgroundColor, ...rest }: Props) {
    const colors = useThemeColor()
    return <View style={[
        styles,
        { backgroundColor: backgroundColor ?? colors.background },
        style,
    ]} {...rest} />
}

const styles = {
    borderRadius: 8,
    overflow: "hidden",

} satisfies ViewStyle