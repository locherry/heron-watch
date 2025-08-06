import { t } from "i18next";
import React from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
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
import { H2 } from "~/components/ui/typography";
import { Plus } from "~/lib/icons/Plus";
import { useFetchQuery } from "~/lib/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const { data, isLoading, isError } = useFetchQuery("/users", "get");
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Calculate the column widths dynamically based on screen width
  const columnWidths = React.useMemo(() => {
    const minColumnWidths = [120, 120, 180, 180];
    return minColumnWidths.map((minWidth) => {
      const evenWidth = width / minColumnWidths.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  if (isLoading) {
    return <Text>Loading users...</Text>;
  }

  if (isError) {
    return <Text>Error loading users</Text>;
  }

  return (
    <RootView>
      <Row className="flex-none">
        <H2 className="flex-1">{capitalizeFirst(t("common.users"))}</H2>
        <Button
          className="ml-auto"
          variant="outline"
          icon={Plus}
          onPress={() => console.log("Add User")}
          disabled
        />
      </Row>
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        <Table aria-labelledby="user-table">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: columnWidths[0] }}>
                <Text>{capitalizeFirst(t("user.firstName"))}</Text>
              </TableHead>
              <TableHead style={{ width: columnWidths[1] }}>
                <Text>{capitalizeFirst(t("user.lastName"))}</Text>
              </TableHead>
              <TableHead style={{ width: columnWidths[2] }}>
                <Text>{capitalizeFirst(t("user.email"))}</Text>
              </TableHead>
              <TableHead style={{ width: columnWidths[3] }}>
                <Text>{capitalizeFirst(t("user.role"))}</Text>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Using map to render each user row */}
            {data?.data?.map((user, index) => (
              <TableRow
                key={user.id}
                className={index % 2 ? "bg-muted/40" : ""}
              >
                <TableCell style={{ width: columnWidths[0] }}>
                  <Text>{user.first_name}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[1] }}>
                  <Text>{user.last_name}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[2] }}>
                  <Text>{user.email}</Text>
                </TableCell>
                <TableCell style={{ width: columnWidths[3] }}>
                  <Text>{t("user." + user.role)}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell className="flex-1 justify-center">
                <Text className="text-foreground">Total Users</Text>
              </TableCell>
              <TableCell className="items-end pr-8">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => t(`Total users: ${data?.data?.length}`)}
                >
                  <Text>{data?.data?.length}</Text>
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollView>
    </RootView>
  );
}
