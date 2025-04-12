import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps & {
    gap?: number,
    center?: boolean
}

export function Column({ style, gap, center, ...rest }:Props) {
    return <View style={[
        rowStyle, 
        style, 
        gap ? { gap: gap } : {},
        center ? {alignItems: "center"}: {}
    ]} {...rest}/>
}

const rowStyle = {
    flexDirection:"column",
    // alignItems: "center"
} satisfies ViewStyle