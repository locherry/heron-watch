import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { Row } from "./Row";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "./Themed/ThemedText";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import { IconSymbol } from "./ui/IconSymbol";

type Props = ViewProps & {
    title:string,
    rightCornerText? : string
}

export function Header({ style, title, rightCornerText, ...rest }: Props) {
    const colors = useThemeColor()
    return <Row style={[styles.header, style]}>
        <Pressable onPress={router.back}>
            <Row gap={8}>
                <IconSymbol name="chevron.left" size={32}/>
                <ThemedText
                    color="text"
                    variant="h1"
                    style={{ textTransform: "capitalize" }}
                >
                    {title}
                </ThemedText>
            </Row>
        </Pressable>
        <ThemedText color="text" variant="h3">{rightCornerText??""}</ThemedText>
    </Row>
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        justifyContent: "space-between",
    },
})