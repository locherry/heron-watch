import { StyleSheet, View, type ViewProps} from "react-native";

type Props = ViewProps & {}

export function Select({style, ...rest} : Props){
    return <View style={[style, styles.root]} {...rest}>
        
    </View>
}

const styles = StyleSheet.create({
    root: {}
})