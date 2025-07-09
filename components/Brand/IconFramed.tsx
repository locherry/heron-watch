import { Image, StyleSheet, View, type ViewProps } from "react-native";

type Props = ViewProps & {
    height?: number,
    width?: number,
}

export function IconFramed({ style, height, width, ...rest }: Props) {
    return <View style={[styles.root, {
        width: width ?? 48,
        height: height ?? 48,
    }, style]} {...rest}>
        <Image
            source={require('@/assets/images/icon.png')}
            style={[styles.img, {
                width: width ?? 48,
                height: height ?? 48,
            }]}
        />
    </View>
}

const styles = StyleSheet.create({
    root: {
        // backgroundColor: "blue",
        borderBottomRightRadius:10,
        borderTopLeftRadius:10,
    },
    img: {
        width: 48,
        height: 48
    }
})