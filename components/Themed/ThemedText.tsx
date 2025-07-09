import { useThemeColor } from "@/hooks/color/useThemeColor";
import React from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

const styles = StyleSheet.create({
    h1: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
        marginBottom:12
    },
    h2: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "bold",
        marginBottom:8
    },
    h3: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "bold"
    },
    h4: {
        fontSize: 12,
        lineHeight: 24,
        fontWeight: "bold"
    },
    body: {
        fontSize: 12,
        lineHeight: 16
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16
    },
    link: {
        fontSize: 12,
        lineHeight: 16,
        textDecorationLine: "underline"
    }
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: string
    align?: 'center' | 'left' | 'right' | 'justify',
    capitalizeFirst?: boolean
    weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
}

export function ThemedText({ variant, align, color, style, children, capitalizeFirst, weight, ...rest }: Props) {
    const colors = useThemeColor();
    const isHeading = variant?.startsWith('h');

    const capitalizeFirstLetter = () => {
        if (!children) {
            return children
        } else if (typeof children == 'string') {
            let string = children as string
            if (string.length > 0) {
                string = string[0].toUpperCase() + string.slice(1)
                return string
            }
        } else if (
            // check if typeof children = string[] 
            typeof children == 'object' &&
            children !== null &&
            Array.isArray(children) &&
            '0' in children &&
            typeof children[0] == 'string'
        ) {
            let string = children[0] as string
            if (string.length > 0) {
                string = string[0].toUpperCase() + string.slice(1)
                // return string
            }
            return [string, ...children.slice(1)]
        } else if (React.isValidElement(children)) {
            const childProps = children.props as { children: any }
            if (childProps && typeof childProps.children === 'string') {
                let string = childProps.children;
                if (string.length > 0) {
                    string = string[0].toUpperCase() + string.slice(1);
                }
                return React.cloneElement(children, childProps, string);
            }
        }
        return children
    }
    const renderText = () => {
        if (isHeading || capitalizeFirst) {
            return capitalizeFirstLetter()
        }
        return children;
    };
    return <Text style={[
        styles[variant ?? "body"],
        {
            color: color ?? colors.text,
            textAlign: align ?? undefined,
            fontWeight: weight ?? undefined
        },
        style
    ]} {...rest}>
        {renderText()}
    </Text>
}