import { ActionTable } from '@/components/Action/ActionTable';
import { ActionTableEntry, ActionType } from '@/components/Action/ActionTableEntry';
import { ActionTableHeader } from '@/components/Action/ActionTableHeader';
import { Card } from '@/components/ui/Card';
import { Column } from '@/components/ui/Column';
import { Header } from '@/components/Header';
import { QRScanner } from '@/components/QRScanner';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/ui/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { BtnIcon } from '@/components/ui/BtnIcon';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { IconSymbolName } from '@/constants/Icons';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Route, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
    const date = new Date("2005-04-12")
    const actions = [
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Mi", date: date },
        { name: "stock", productName: "foie de volaille", quantity: 69, userName: "Jean-Fa", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
        { name: "sell", productName: "foie de volaille", quantity: 8, userName: "Jean-Sol", date: date },
    ] as ActionType[]

    type ActionBtn = {
        name: string,
        iconName: IconSymbolName,
        href: Route
    }
    const actionBtns = [{
        name: "Sell",
        iconName: "tag.fill",
        href: "/home/sell"
    }, {
        name: "Stock",
        iconName: "rectangle.stack",
        href: "/home/stock"
    }, {
        name: "Give",
        iconName: "gift.fill",
        href: "/home/give"
    }, {
        name: "Discard",
        iconName: "trash",
        href: "/home/discard"
    }, {
        name: "Transfer to the shop",
        iconName: "arrow.right.arrow.left",
        href: "/home/transfer"
    },] as ActionBtn[]

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>Welcome Home</ThemedText>
            <Row gap={8}>
                {actionBtns.map((actionBtn) =>
                    <Pressable onPress={() => router.push(actionBtn.href)} key={actionBtn.href} style={{ alignSelf: 'flex-start' }}>
                        <Column style={{ width: 66 }}>
                            <BtnIcon size={50} iconName={actionBtn.iconName} />
                            <ThemedText style={{ textAlign: 'center' }}>{actionBtn.name}</ThemedText>
                        </Column>
                    </Pressable>)}
            </Row>
            <ThemedText variant='h2'>History</ThemedText>
            <ActionTable actions={actions} />
        </Card>
    </RootView>
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    card: {
        gap: 16,
        flex: 1,
        padding: 16,
        alignItems: 'center',
    }
});