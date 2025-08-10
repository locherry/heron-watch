import { t } from "i18next";
import * as React from "react";
import { FlatList, ScrollView, useWindowDimensions } from "react-native";
import { Action } from "~/@types/action";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";

interface ActionCreationTableProps {
  data: Action[];
}

export function ActionCreationTable({ data }: ActionCreationTableProps) {
  const { width } = useWindowDimensions();

  const columnWidths = React.useMemo(() => {
    const minColumnWidths = [120, 120, 180, 180, 180, 180, 180, 180, 180, 120, 120]; // Added two columns for buttons
    return minColumnWidths.map((minWidth) => {
      const evenWidth = width / minColumnWidths.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  return (
    <Table aria-labelledby="action-creation-table">
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: columnWidths[0] }}>
            <Text>{capitalizeFirst(t("actions.id"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[1] }}>
            <Text>{capitalizeFirst(t("actions.quantity"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[2] }}>
            <Text>{capitalizeFirst(t("actions.comment"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[3] }}>
            <Text>{capitalizeFirst(t("actions.product_code"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[4] }}>
            <Text>{capitalizeFirst(t("actions.lot_number"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[5] }}>
            <Text>{capitalizeFirst(t("actions.created_by_id"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[6] }}>
            <Text>{capitalizeFirst(t("actions.created_at"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[7] }}>
            <Text>{capitalizeFirst(t("actions.action_id"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[8] }}>
            <Text>{capitalizeFirst(t("actions.transaction"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[9] }}>
            <Text>{capitalizeFirst(t("common.edit"))}</Text>
          </TableHead>
          <TableHead style={{ width: columnWidths[10] }}>
            <Text>{capitalizeFirst(t("common.delete"))}</Text>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <TableRow
                key={item.id}
                className={index % 2 ? "bg-muted/40" : ""}
              >
                <TableCell style={{ width: columnWidths[0] }}>
                  <Text>{item.id}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[1] }}>
                  <Text>{item.quantity}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[2] }}>
                  <Text>{item.comment}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[3] }}>
                  <Text>{item.product_code}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[4] }}>
                  <Text>{item.lot_number}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[5] }}>
                  <Text>{item.created_by_id}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[6] }}>
                  <Text>{item.created_at}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[7] }}>
                  <Text>{item.action_id}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[8] }}>
                  <Text>{item.transaction}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[9] }}>
                  <Button size="sm" variant="outline" onPress={() => { /* TODO: common.edit callback */ }}>
                    {t("common.edit")}
                  </Button>
                </TableCell>
                <TableCell style={{ width: columnWidths[10] }}>
                  <Button size="sm" variant="destructive" onPress={() => { /* TODO: common.delete callback */ }}>
                    {t("common.delete")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
            keyExtractor={(item) => item.id.toString()}
            bounces={false}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell className="flex-1 justify-center">
            <Text className="text-foreground">{t("Total actions")}</Text>
          </TableCell>
          <TableCell className="items-end pr-8">
            <Button size="sm" variant="ghost">
              <Text>{data?.length}</Text>
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
