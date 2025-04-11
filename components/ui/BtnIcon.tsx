import { useThemeColor } from "@/hooks/color/useThemeColor";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { IconSymbolName } from "@/constants/Icons";

type Props = ViewProps & {
    iconName: IconSymbolName,
    size?: number,
    backgroundColor?: string,
    onPress?: () => void,
}

export function BtnIcon({ style, iconName, backgroundColor, size = 20, onPress, ...rest }: Props) {
    const colors = useThemeColor()
    const content =  <View
        style={[{ backgroundColor: backgroundColor ?? colors.tint, height: size + 16, width: size + 16 }, style, styles.root]}
        {...rest}>
        <IconSymbol name={iconName} size={size} />
    </View>

    
  // Only wrap with Pressable if onPress is provided
  return onPress ? (
    <Pressable onPress={onPress}>{content}</Pressable>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
    root: {
        padding: 8,
        borderRadius: 8
    }
})