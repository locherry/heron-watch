import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { t } from "i18next";
import { Platform } from "react-native";
import * as XLSX from "xlsx";
import { ActionSortState } from "~/@types/action";
import { StockCategory } from "~/@types/stock";
import { apiFetch } from "~/lib/apiClient";
import { constants } from "~/lib/constants";
import { capitalizeFirst } from "~/lib/utils";

export type ExportActionsFilters = {
  stockCategory: StockCategory;
  sorting?: ActionSortState | null;
  startDate?: Date;
  endDate?: Date;
  actionCategoryId?: string;
  productCode?: string;
  batchNumber?: string;
};

const EXPORT_PAGE_SIZE = 50;

function endOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function buildQuery(filters: ExportActionsFilters, page: number) {
  return {
    stock_category: filters.stockCategory,
    page,
    itemsPerPage: EXPORT_PAGE_SIZE,
    ...(filters.sorting
      ? { [`order[${filters.sorting.order_by}]`]: filters.sorting.sort }
      : {}),
    ...(filters.startDate
      ? { "created_at[after]": filters.startDate.toISOString() }
      : {}),
    ...(filters.endDate
      ? { "created_at[before]": endOfDay(filters.endDate).toISOString() }
      : {}),
    ...(filters.actionCategoryId
      ? { action_category: filters.actionCategoryId }
      : {}),
    ...(filters.productCode
      ? { "product.product_code": filters.productCode }
      : {}),
    ...(filters.batchNumber ? { batch_number: filters.batchNumber } : {}),
  };
}

async function fetchAllActions(filters: ExportActionsFilters) {
  const all: any[] = [];
  let page = 1;
  let totalItems = Infinity;

  while (all.length < totalItems) {
    const query = buildQuery(filters, page) as any;
    const response = await apiFetch("/api/actions", "get", { query } as any);

    const member = (response as any)?.["member"] ?? [];
    totalItems = (response as any)?.["totalItems"] ?? member.length;
    all.push(...member);

    if (member.length === 0) break;
    page += 1;
  }

  return all;
}

function extractIdFromIri(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parts = value.split("/");
  return parts[parts.length - 1] || null;
}

function getProductCode(action: any): string {
  if (action.product?.product_code) return action.product.product_code;
  if (typeof action.product === "string") return action.product;
  return "";
}

function getActionCategoryLabel(action: any): string {
  const raw = action.action_category;
  const idCandidate =
    typeof raw === "object" ? raw?.id : (extractIdFromIri(raw) ?? raw);

  const matched = constants.actionTypes.find(
    (o) => String(o.value) === String(idCandidate),
  );
  if (matched) return capitalizeFirst(t(matched.label));
  return String(idCandidate ?? "");
}

function toRow(action: any) {
  return {
    [capitalizeFirst(t("actions.createdAt"))]: action.created_at
      ? new Date(action.created_at).toLocaleString()
      : "",
    [capitalizeFirst(t("actions.productCode"))]: getProductCode(action),
    [capitalizeFirst(t("actions.batchNumber"))]: action.batch_number ?? "",
    [capitalizeFirst(t("actions.quantity"))]: action.quantity ?? "",
    [capitalizeFirst(t("actions.actionType"))]: getActionCategoryLabel(action),
    [capitalizeFirst(t("actions.transactionCode"))]:
      action.transaction_code ?? "",
    [capitalizeFirst(t("actions.createdBy"))]: action.created_by?.id
      ? action.created_by.first_name + " " + action.created_by.last_name
      : t("user.unknownUser"),
    [capitalizeFirst(t("actions.comment"))]: action.comment ?? "",
    [capitalizeFirst(t("actions.expireAt"))]: action.expire_at
      ? new Date(action.expire_at).toLocaleDateString()
      : "",
  };
}

async function saveWorkbook(
  rows: ReturnType<typeof toRow>[],
  fileName: string,
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Actions");

  if (Platform.OS === "web") {
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const bytes = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as number[];
  const file = new File(Paths.document, fileName);
  file.write(new Uint8Array(bytes));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export actions",
    });
  }
}

export async function exportActionsToSpreadsheet(
  filters: ExportActionsFilters,
) {
  const actions = await fetchAllActions(filters);
  const rows = actions.map(toRow);
  const fileName = `actions-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
  await saveWorkbook(rows, fileName);
  return actions.length;
}
