import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/color/useThemeColor";
import React, { useLayoutEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, TextInput, type ViewProps } from "react-native";

type Props = ViewProps & {
    placeHolder?: string,
    color?: keyof typeof Colors["light"] & keyof typeof Colors["dark"],
    backgroundColor?: string,
    onChange: (s: string) => void,
    value?: string,
    textContentType?: React.ComponentPropsWithoutRef<typeof TextInput>['textContentType']
    secureTextEntry?: boolean // For passwords to appear with little dots
}

export function ThemedTextInput({ style, textContentType, placeHolder, value, onChange, secureTextEntry, backgroundColor, ...rest }: Props) {
    const colors = useThemeColor()
    const textInputRef = useRef<any>(null);
    const focusOnTextInput = () => {
        textInputRef?.current.focus()
    }
    if (Platform.OS == "web") {
        useLayoutEffect(() => {
            textInputRef.current.style.setProperty("transition", 'background-color 5000s', "important");
            textInputRef.current.style.setProperty("color", colors.text, "important");
            textInputRef.current.style.setProperty("-webkit-text-fill-color", colors.text, "important");
        }, []) //Used to disable auto completion background color behaviour on textInput
    }

    return <Pressable onPress={focusOnTextInput} onFocus={focusOnTextInput} style={[styles.root, { backgroundColor: colors.gray200 }]}>
        <TextInput
            textContentType={textContentType ?? "none"}
            ref={textInputRef}
            style={[styles.textInput, { color: colors.text, paddingHorizontal: 8 }]}
            value={value ?? ""}
            placeholder={placeHolder ?? ""}
            placeholderTextColor={colors.text}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry ?? false}
            {...rest}
        />
    </Pressable>
}

const styles = StyleSheet.create({
    root: {
        borderRadius: 8,
        // width: "100%",
        height: 40,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        width: "100%",
        height: "100%",
    }
})