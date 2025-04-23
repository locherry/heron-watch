import { IconSymbolName } from '@/constants/Icons';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Row } from '../layout/Row';
import { ThemedText } from '../Themed/ThemedText';
import { IconSymbol } from './Icon/IconSymbol';

type Option<T> = {
    label: string;
    value: T;
    iconName?: IconSymbolName
};

type SelectProps<T> = {
    options: readonly Option<T>[];
    selectedValue: T | null;
    onSelect: (value: T) => void;
    placeholder?: string;
};

export const Select = <T extends string | number>({
    options,
    selectedValue,
    onSelect,
    placeholder = "Select an option"
}: SelectProps<T>) => {
    const placeholderOption = {
        label: placeholder,
        value: 'placeholder',
        iconName: undefined
    }
    const colors = useThemeColor()
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: T) => {
        onSelect(value);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue) || placeholderOption;

    const styles = StyleSheet.create({
        ...constantStyles,
        selectedOption: {
            backgroundColor: colors.gray200
        },
        option: {
            ...constantStyles.option,
            backgroundColor: colors.gray100,
            borderBottomColor: colors.gray300
        },
        optionText: {
            ...constantStyles.optionText,
            color: colors.gray900
        },
        triggerText: {
            ...constantStyles.triggerText,
            color: colors.gray900
        }

    })

    return <View style={styles.container}>
        <Pressable
            style={styles.trigger}
            onPress={() => setIsOpen(!isOpen)}
        >
            <Row gap={8}>
                {selectedOption.iconName ? <IconSymbol name={selectedOption.iconName} /> : null}
                <ThemedText capitalizeFirst style={styles.triggerText}>{selectedOption.label}</ThemedText>
            </Row>
        </Pressable>

        {isOpen && (
            <View style={styles.optionsContainer}>
                <FlatList
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.option,
                                selectedValue === item.value && styles.selectedOption
                            ]}
                            onPress={() => handleSelect(item.value)}
                        >
                            <Row gap={8}>
                                {item.iconName ? <IconSymbol name={item.iconName} /> : null}
                                <ThemedText capitalizeFirst style={styles.optionText}>{item.label}</ThemedText >
                            </Row>
                        </Pressable>
                    )}
                />
            </View>
        )}
    </View>
};

const constantStyles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%"
    },
    trigger: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 4
    },
    triggerText: {
        fontSize: 16
    },
    optionsContainer: {
        position: "absolute",
        top: "100%",
        width: "100%",
        marginTop: 4,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        zIndex: 10,
        elevation: 10, // Android elevation
    },
    option: {
        padding: 12,
        zIndex: 10,
        borderBottomWidth: 1,
    },
    selectedOption: {
    },
    optionText: {
        fontSize: 16
    }
});
