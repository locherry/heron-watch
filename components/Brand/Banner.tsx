import { StyleSheet, View, type ViewProps } from "react-native";
import { IconFramed } from "./IconFramed";
import { Row } from "../ui/Row";
import { Column } from "../ui/Column";
import { ThemedText } from "../Themed/ThemedText";
import { useThemeColor } from "@/hooks/color/useThemeColor";
type Props = ViewProps & {}
export function Banner({ style, ...rest }: Props) {
    const colors = useThemeColor()
    return <Row gap={16} style={[style, styles.root]} {...rest}>
        <IconFramed width={72} height={72}/>
        <Column>
            <ThemedText variant="h1">Heron Watch</ThemedText>
            <ThemedText variant="subtitle" color={colors.gray700}>Stock management solutions</ThemedText>
        </Column>
    </Row>
}
const styles = StyleSheet.create({
    root: {
        alignItems:"center",
        justifyContent:"center"
    }
})