import { Card } from '@/components/layout/Card';
import { Column } from '@/components/layout/Column';
import { RootView } from '@/components/layout/RootView';
import { Row } from '@/components/layout/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Button } from '@/components/ui/Button/Button';
import { DataTable, TableColumn } from '@/components/ui/DataTable';
import { IconSymbolName } from '@/constants/Icons';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { Route, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

export default function Home() {
    const { t } = useTranslation()
    const formatDate = useDateFormatter();

    type ActionType = {
        id: number,
        quantity: number
        comment: string
        product_code: string
        lot_number: number
        created_by_id: number
        created_at: Date
        action_id: number
    }
    const date = new Date("2005-04-12")
    const defaultActions = [
        { id: 1, quantity: 8, comment: '', product_code: "FDC", lot_number: 432, created_at: date, created_by_id: 1, action_id: 2 },
        { id: 1, quantity: 8, comment: '', product_code: "FDC", lot_number: 432, created_at: date, created_by_id: 1, action_id: 2 },
        { id: 1, quantity: 8, comment: '', product_code: "FDC", lot_number: 432, created_at: date, created_by_id: 1, action_id: 2 },
    ] satisfies ActionType[]
    const [actions, setActions] = useState(defaultActions)

    useEffect(() => {
        useFetchQuery('/actions').then(res => {
            res && setActions(res)
        })
    }, [])

    const columns: TableColumn<ActionType>[] = [
        { key: 'id', header: t('action') },
        {
            key: 'quantity',
            header: '#',
            //   renderCell: (item: ActionType) => <Text style={{ color: colors.info }}>{item.quantity}</Text>
        },
        { key: 'product_code', header: t('product') },
        {
            key: 'created_at',
            header: t('date'),
            renderCell: (item: ActionType) => formatDate(item.created_at).replace(' ', '\n')
        },
        { key: 'created_by_id', header: t('common.user') },
    ];

    type ActionBtn = {
        name: string,
        iconName: IconSymbolName,
        href: Route
    }
    const actionBtns = [{
        name: "sell",
        iconName: "tag",
        href: "/home/sell"
    }, {
        name: "stock",
        iconName: "rectangle.stack",
        href: "/home/stock"
    }, {
        name: "give",
        iconName: "gift",
        href: "/home/give"
    }, {
        name: "discard",
        iconName: "trash",
        href: "/home/discard"
    }, {
        name: "transfer to the shop",
        iconName: "arrow.right.arrow.left",
        href: "/home/transfer"
    },] satisfies ActionBtn[]

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1' capitalizeFirst>
                {t("welcome home !")}
            </ThemedText>
            <Row gap={8}>
                {actionBtns.map((actionBtn) =>
                    <Pressable onPress={() => router.push(actionBtn.href)} key={actionBtn.href} style={{ alignSelf: 'flex-start' }}>
                        <Column style={{ width: 66 }}>
                            <Button
                                onPress={() => router.push(actionBtn.href)}
                                iconSize={50}
                                iconName={actionBtn.iconName}
                                type='primary'
                            />
                            <ThemedText style={{ textAlign: 'center' }} capitalizeFirst>{t(actionBtn.name)}</ThemedText>
                        </Column>
                    </Pressable>)}
            </Row>
            <ThemedText variant='h2'>{t("history")}</ThemedText>
            
            <DataTable
                data={actions}
                columns={columns} />
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