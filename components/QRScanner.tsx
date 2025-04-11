import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

type Props = ViewProps & {
    onPress: ()=>void,

}

export function QRScanner({ style, onPress, ...rest }: Props) {
    const colors = useThemeColor()
    return <Pressable onPress={onPress} style={[{backgroundColor:colors.tint}, style, styles.root]} {...rest}>
        <IconSymbol name="viewfinder.rectangular" size={45} style={{flex:1}}/>
    </Pressable>
}

const styles = StyleSheet.create({
    root: {
        padding:8,
        borderRadius:8,
        width:66,
        // height:61
    }
})