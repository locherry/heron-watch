import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { BaseTableProps } from "~/@types/table";
import { UserRead } from "~/@types/user";
import { useFormatDate } from "~/lib/hooks/useformatDate";
import { capitalizeFirst } from "~/lib/utils";
import { BaseTable } from "./BaseTable";

type UserTableProps = Omit<BaseTableProps<UserRead>, "columns">;

export function UserTable({
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  ...props
}: UserTableProps) {
  const [t] = useTranslation();
  const formatDate = useFormatDate();

  const columns: ColumnDef<UserRead>[] = [
    {
      id: "email",
      accessorKey: "email",
      header: () => capitalizeFirst(t("user.email")),
    },
    {
      id: "first_name",
      accessorKey: "first_name",
      header: () => capitalizeFirst(t("user.firstName")),
    },
    {
      id: "last_name",
      accessorKey: "last_name",
      header: () => capitalizeFirst(t("user.lastName")),
    },
    {
      id: "roles",
      accessorKey: "roles",
      header: () => capitalizeFirst(t("user.roles")),
    },
  ];

  return (
    <BaseTable
      {...props}
      data={props.data ?? []}
      columns={columns}
      features={{ sorting: props.sorting, edition: props.editEnabled }}
      onPageChange={onPageChange}
      page={page}
      totalPages={totalPages}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
