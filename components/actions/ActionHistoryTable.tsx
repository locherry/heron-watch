import * as React from "react";
import { ScrollView } from "react-native";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";
import { t } from "i18next";
import { Button } from "~/components/ui/button";

type Action = {
  id: number | string;
  quantity: number;
  comment?: string;
  product_code?: number;
  lot_number?: string;
  created_by_id?: number;
  created_at?: string;
  action_id?: number;
  transaction?: string;
};

interface ActionHistoryTableProps {
  data: Action[];
  columnWidths: number[];
}

export function ActionHistoryTable({ data, columnWidths }: ActionHistoryTableProps) {
  return (
    <ScrollView
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
      <Table aria-labelledby="action-table">
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
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((action, index) => (
            <TableRow
              key={action.id}
              className={index % 2 ? "bg-muted/40" : ""}
            >
              <TableCell style={{ width: columnWidths[0] }}>
                <Text>{action.id}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[1] }}>
                <Text>{action.quantity}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[2] }}>
                <Text>{action.comment}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[3] }}>
                <Text>{action.product_code}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[4] }}>
                <Text>{action.lot_number}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[5] }}>
                <Text>{action.created_by_id}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[6] }}>
                <Text>{action.created_at}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[7] }}>
                <Text>{action.action_id}</Text>
              </TableCell>
              <TableCell style={{ width: columnWidths[8] }}>
                <Text>{action.transaction}</Text>
              </TableCell>
            </TableRow>
          ))}
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
    </ScrollView>
  );
}
