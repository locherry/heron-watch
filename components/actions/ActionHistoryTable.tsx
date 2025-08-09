import { InfiniteQueryObserverResult } from '@tanstack/react-query';
import { t } from "i18next";
import * as React from "react";
import { FlatList, ScrollView } from 'react-native';
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";

type GenericFetchNextPage = (
  options?: { cancelRefetch?: boolean; pageParam?: unknown }
) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;

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
  fetchNextPage? :  GenericFetchNextPage;
}

/**
 * Displays a horizontally scrollable table of action history records.
 * Each row corresponds to an action with several columns showing its details.
 *
 * @param data - Array of action objects to display
 * @param columnWidths - Array of widths for each column to control layout
 * @param fetchNextPage - Optionnal closure that charge next data for infinite scroll
 */
export function ActionHistoryTable({ data, columnWidths, fetchNextPage }: ActionHistoryTableProps) {
  return (
    // Flatlist enables horizontal scrolling for wide tables
    <Table aria-labelledby="action-table">
      {/* Table Header with column titles */}
      <TableHeader>
        <TableRow>
          {/* Each TableHead corresponds to a column, width controlled by columnWidths */}
          <TableHead style={{ width: columnWidths[0] }}>
            {/* Use i18next translation with capitalized first letter */}
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

      {/* Table body with one row per action */}
      <TableBody>
        <ScrollView style = {{flex: 1}} horizontal showsHorizontalScrollIndicator>
          <FlatList
            style = {{height : 400}}
            data = {data}
            renderItem={({item, index}) => (
                <TableRow
                  key={item.id} // Use unique id as key
                  className={index % 2 ? "bg-muted/40" : ""} // Alternate row background for readability
                >
                  {/* Each TableCell displays a specific action property with matching width */}
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
                </TableRow>
              )}
              keyExtractor={(item) => item.id.toString()}
              bounces={false} // Disable bounce effect on scroll
              showsVerticalScrollIndicator={false} // Hide horizontal scrollbar for cleaner UI
              onEndReached={() => fetchNextPage}
            />
            </ScrollView>
          </TableBody>

          {/* Table footer showing the total number of actions */}
          <TableFooter>
            <TableRow>
              <TableCell className="flex-1 justify-center">
                {/* Label for total count */}
                <Text className="text-foreground">{t("Total actions")}</Text>
              </TableCell>
              <TableCell className="items-end pr-8">
                {/* Button styled container to display total number of rows */}
                <Button size="sm" variant="ghost">
                  <Text>{data?.length}</Text>
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
  );
}
