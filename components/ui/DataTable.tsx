import { useThemeColor } from '@/hooks/color/useThemeColor';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '../Themed/ThemedText';

export interface TableColumn<T> {
    key: keyof T;
    header: string;
    renderCell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
}

const calculateTextWidth = (text: string, fontSize: number = 14): number => {
    const firstLine = text.split('\n')[0]
    return Math.min(120, Math.max(20, firstLine.length * fontSize * 0.6));
};

export function DataTable<T extends object>({ data, columns }: TableProps<T>) {
    const colors = useThemeColor()
    const columnWidths = useMemo(() => {
        return columns.map(column => {
            let maxWidth = calculateTextWidth(column.header);
            data.forEach(item => {
                const value = String(item[column.key]);
                maxWidth = Math.max(maxWidth, calculateTextWidth(value));
            });
            return maxWidth;
        });
    }, [data, columns]);

    const headerRow = (
        <View style={[
            styles.headerRow, {
                borderBottomColor: colors.gray300,
            }]}>
            {columns.map((column, index) => (
                <View key={index.toString()} style={{ width: columnWidths[index] }}>
                    <ThemedText style={styles.headerText} capitalizeFirst>{column.header}</ThemedText>
                </View>
            ))}
        </View>
    );

    const renderItem = ({ item }: { item: T }) => (
        <View style={[styles.row, {
            borderBottomColor: colors.gray200}]}>
            {columns.map((column, index) => (
                <View key={index.toString()} style={{ width: columnWidths[index] }}>
                    <ThemedText style={styles.cellText}>
                        {column.renderCell ? column.renderCell(item) : String(item[column.key])}
                    </ThemedText>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {headerRow}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                // horizontal={true}
                persistentScrollbar
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 2,
    },
    headerText: {
        fontWeight: '600',
        paddingHorizontal: 4,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    cellText: {
        paddingHorizontal: 4,
    },
});
