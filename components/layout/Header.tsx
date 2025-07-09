import { router } from "expo-router";
import { Pressable, StyleSheet, type ViewProps } from "react-native";
import { ThemedText } from "../Themed/ThemedText";
import { IconSymbol } from "../ui/Icon/IconSymbol";
import { Row } from "./Row";

type Props = ViewProps & {
    title:string,
    rightCornerText? : string
}

export function Header({ style, title, rightCornerText, ...rest }: Props) {

    return <Row style={[styles.header, style]}>
        <Pressable onPress={router.back}>
            <Row gap={8}>
                <IconSymbol name="chevron.left" size={32}/>
                <ThemedText
                    variant="h1"
                    style={{ textTransform: "capitalize", marginBottom: 0, marginTop: 0 }}
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