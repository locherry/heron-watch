import { useThemeColor } from "@/hooks/color/useThemeColor";
import { StyleSheet, type ViewProps } from "react-native";
import { ThemedText } from "../Themed/ThemedText";
import { Column } from "../layout/Column";
import { Row } from "../layout/Row";
import { IconFramed } from "./IconFramed";
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