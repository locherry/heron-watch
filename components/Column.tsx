import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps & {
    gap?: number
}

export function Column({ style, gap, ...rest }:Props) {
    return <View style={[rowStyle, style, gap ? { gap: gap } : undefined]} {...rest}/>
}

const rowStyle = {
    flexDirection:"column",
    alignItems: "center"
} satisfies ViewStyle