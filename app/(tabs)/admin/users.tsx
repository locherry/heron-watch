import { Plus } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView } from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
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
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst } from "~/lib/utils";

export default function App() {
  const [t] = useTranslation();

  const { data, isLoading, isError } = useFetchQuery("/api/users", "get");

  if (isError) {
    return <Text>Error loading users</Text>;
  }

  return (
    <RootView>
      <Header title={capitalizeFirst(t("common.users"))}>
        <Button
          className="ml-auto"
          variant="outline"
          icon={Plus}
          onPress={() => console.log("Add User")}
          disabled
        />
      </Header>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
        >
          <Table aria-labelledby="user-table">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Text>{capitalizeFirst(t("user.firstName"))}</Text>
                </TableHead>
                <TableHead>
                  <Text>{capitalizeFirst(t("user.lastName"))}</Text>
                </TableHead>
                <TableHead>
                  <Text>{capitalizeFirst(t("user.email"))}</Text>
                </TableHead>
                <TableHead>
                  <Text>{capitalizeFirst(t("user.role"))}</Text>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={index % 2 ? "bg-muted/40" : ""}
                >
                  <TableCell>
                    <Text>{user.first_name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{user.last_name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{user.email}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>
                      {user.roles.map(
                        (role, index) =>
                          capitalizeFirst(
                            t(
                              ("user." + role) as
                                | "user.ROLE_USER"
                                | "user.ROLE_ADMIN",
                            ),
                          ) + (index < user.roles.length - 1 ? ", " : ""),
                      )}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell className="flex-1 justify-center">
                  <Text className="text-foreground">{t("Total users")}</Text>
                </TableCell>
                <TableCell className="items-end pr-8">
                  <Text>{data?.length}</Text>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollView>
      )}
    </RootView>
  );
}
