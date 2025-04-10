import { ActionTable } from '@/components/Action/ActionTable';
import { ActionTableEntry, ActionType } from '@/components/Action/ActionTableEntry';
import { ActionTableHeader } from '@/components/Action/ActionTableHeader';
import { Card } from '@/components/Card';
import { Column } from '@/components/Column';
import { Header } from '@/components/Header';
import { QRScanner } from '@/components/QRScanner';
import RootView from '@/components/RootView';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { BtnIcon } from '@/components/ui/BtnIcon';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';

export default function Tab() {
    const colors = useThemeColor()
    const onPress = () => { }
    const actionName = [
        'Je vends', 'je stocke', 'je donne', 'je transfere au magasin', 'je jette', 'je '
    ]
    const date = new Date("2005-04-12")
    const actions = [
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
    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText variant='h1'>Welcome Home</ThemedText>
                <Row gap={8}>
                    <Column>
                        <Link href="/home/sell" asChild>
                            <BtnIcon size={50} iconName="tag.fill" />
                        </Link>
                        <ThemedText>Sell</ThemedText>
                        <ThemedText> </ThemedText>
                    </Column>
                    <Column>
                        <Link href="/home/stock" asChild>
                            <BtnIcon size={50} iconName="rectangle.stack" />
                        </Link>
                        <ThemedText>Stock</ThemedText>
                        <ThemedText> </ThemedText>
                    </Column>
                    <Column>
                        <Link href="/home/give" asChild>
                            <BtnIcon size={50} iconName="gift.fill" />
                        </Link>
                        <ThemedText>Give</ThemedText>
                        <ThemedText> </ThemedText>
                    </Column>
                    <Column>
                        <Link href="/home/discard" asChild>
                            <BtnIcon size={50} iconName="trash" />
                        </Link>
                        <ThemedText>Discard</ThemedText>
                        <ThemedText> </ThemedText>
                    </Column>
                    <Column>
                        <Link href="/home/transfer" asChild>
                            <BtnIcon size={50} iconName="arrow.right.arrow.left" />
                        </Link>
                        <ThemedText>Transfer</ThemedText>
                        <ThemedText>to the shop</ThemedText>
                    </Column>
                </Row>
                <ThemedText variant='h2'>History</ThemedText>
                <ScrollView>
                    <ActionTable actions={actions} />
                </ScrollView>
            </Card>
        </RootView>
    )
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