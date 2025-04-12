import { IconSymbolName } from "@/constants/Icons";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { Row } from "./ui/Row";
import { IconSymbol } from "./ui/IconSymbol";
import { Link, Route } from "expo-router";
import { ThemedText } from "./Themed/ThemedText";

type Props = ViewProps & {
    iconName: IconSymbolName,
    href?: Route,
    text?: string,
    onPress?: () => void
}

export function SettingsEntry({ style, iconName, href, text, onPress, ...rest }: Props) {
    let content = <Row style={[style, styles.root]} gap={16}>
        <IconSymbol name={iconName} />
        <View style={styles.content}>
            {text ? <ThemedText>{text}</ThemedText> : <View {...rest} />}
        </View>

        <IconSymbol name='chevron.right' />
    </Row>

    if (href) {
        content = <Link href={href}>{content}</Link>
    }
    if (onPress) {
        content = <Pressable onPress={onPress}>{content}</Pressable>
    }

    return content
}

const styles = StyleSheet.create({
    root: {
        // justifyContent:'flex-start',
        // flex: 1,
        width: '100%'
    },
    content:{
        flex:1
    }
})