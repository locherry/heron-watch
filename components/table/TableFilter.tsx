import { SlidersHorizontal } from "lucide-react-native";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { StockCategory, StockRead } from "~/@types/stock";
import Column from "~/components/layout/Column";
import Row from "~/components/layout/Row";
import {
    BottomSheetModal,
    BottomSheetView,
} from "~/components/ui/bottom-sheet";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useBreakpoint } from "~/lib/hooks/useBreakpoint";
import { useFetchQuery } from "~/lib/hooks/useFetchQuery";
import { capitalizeFirst, cn } from "~/lib/utils";
import { AutocompleteInput } from "../AutoCompleteInput";
import { DateInput } from "../DateInput";

export type SortOption = {
  label: string;
  value: string;
};

export type TableFilterValue = {
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  actionCategoryId?: string;
  productCode?: string;
  batchNumber?: string;
};

export type TableFilterHandle = {
  present: () => void;
  dismiss: () => void;
};

type TableFilterProps = {
  sortOptions: SortOption[];
  defaultValue?: TableFilterValue;
  stockCategory?: StockCategory;
  onApply?: (value: TableFilterValue) => void;
  onReset?: () => void;
  showTriggerButton?: boolean;
};

function useStockAutocomplete(stockMembers: StockRead[]) {
  const [filteredProductCodes, setFilteredProductCodes] = useState<StockRead[]>(
    [],
  );
  const [filteredBatchNumbers, setFilteredBatchNumbers] = useState<StockRead[]>(
    [],
  );

  useEffect(() => {
    const seen = new Set<string>();
    setFilteredProductCodes(
      stockMembers.filter((s) => {
        const code = s.product?.product_code ?? "";
        if (seen.has(code)) return false;
        seen.add(code);
        return true;
      }),
    );
    setFilteredBatchNumbers(stockMembers);
  }, [stockMembers]);

  const filterProductCodes = (text: string) => {
    const seen = new Set<string>();
    setFilteredProductCodes(
      stockMembers.filter((s) => {
        const code = s.product?.product_code ?? "";
        if (seen.has(code) || !code.includes(text)) return false;
        seen.add(code);
        return true;
      }),
    );
  };

  const filterBatchNumbers = (productCode: string, text = "") => {
    const seen = new Set<string>();
    setFilteredBatchNumbers(
      stockMembers.filter((s) => {
        const batch = s.batch_number ?? "";
        if (seen.has(batch) || !batch.includes(text)) return false;
        if (productCode && s.product?.product_code !== productCode)
          return false;
        seen.add(batch);
        return true;
      }),
    );
  };

  return {
    filteredProductCodes,
    filteredBatchNumbers,
    filterProductCodes,
    filterBatchNumbers,
  };
}

export const TableFilter = forwardRef<TableFilterHandle, TableFilterProps>(
  (
    {
      sortOptions,
      defaultValue,
      stockCategory,
      onApply,
      onReset,
      showTriggerButton = true,
    },
    ref,
  ) => {
    const [t] = useTranslation();
    const { isSmallWidth } = useBreakpoint();

    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["40%", "70%"], []);

    const [startDate, setStartDate] = useState<Date | undefined>(
      defaultValue?.startDate,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
      defaultValue?.endDate,
    );
    const [actionCategoryId, setActionCategoryId] = useState<
      string | undefined
    >(defaultValue?.actionCategoryId);
    const [sortBy, setSortBy] = useState<string | undefined>(
      defaultValue?.sortBy,
    );
    const [productCode, setProductCode] = useState(
      defaultValue?.productCode ?? "",
    );
    const [batchNumber, setBatchNumber] = useState(
      defaultValue?.batchNumber ?? "",
    );

    const selectedActionType = constants.actionTypes.find(
      (o) => String(o.value) === actionCategoryId,
    );
    const selectedSortOption = sortOptions.find((o) => o.value === sortBy);

    /* ------------------------------ Stock data ------------------------------ */

    const { data: stockData } = useFetchQuery(
      "/api/stock/current_stock",
      "get",
      {
        query: { stock_category: stockCategory },
      },
    );
    const stockMembers = (stockData?.member as StockRead[]) ?? [];

    const {
      filteredProductCodes,
      filteredBatchNumbers,
      filterProductCodes,
      filterBatchNumbers,
    } = useStockAutocomplete(stockMembers);

    /* -------------------------------- Handlers ------------------------------- */

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleProductCodeChange = (text: string) => {
      setProductCode(text);
      filterProductCodes(text);
      filterBatchNumbers(text, batchNumber);
    };

    const handleProductCodeSelect = (item: { value: string }) => {
      setProductCode(item.value);
      filterBatchNumbers(item.value, batchNumber);
    };

    const handleBatchNumberChange = (text: string) => {
      setBatchNumber(text);
      filterBatchNumbers(productCode, text);
    };

    const handleBatchNumberSelect = (item: { value: string }) => {
      setBatchNumber(item.value);
    };

    const handleApply = () => {
      onApply?.({
        startDate,
        endDate,
        sortBy,
        actionCategoryId,
        productCode: productCode || undefined,
        batchNumber: batchNumber || undefined,
      });
      sheetRef.current?.dismiss();
    };

    const handleReset = () => {
      setStartDate(undefined);
      setEndDate(undefined);
      setSortBy(undefined);
      setActionCategoryId(undefined);
      setProductCode("");
      setBatchNumber("");
      onReset?.();
    };

    /* ------------------------------ Active filters --------------------------- */
    // A filter counts as "active" once it's actually applied, i.e. reflected
    // in defaultValue from the parent, not just typed into the sheet's local
    // state before hitting Apply.
    const hasActiveFilters = !!(
      defaultValue?.startDate ||
      defaultValue?.endDate ||
      defaultValue?.sortBy ||
      defaultValue?.actionCategoryId ||
      defaultValue?.productCode ||
      defaultValue?.batchNumber
    );
    const Wrapper = isSmallWidth ? Column : Row;
    return (
      <>
        {showTriggerButton && (
          <View>
            <Button variant="ghost" onPress={() => sheetRef.current?.present()}>
              <Icon as={SlidersHorizontal} />
            </Button>
            {/* {Displays a notification dot when the filter is active} */}
            {hasActiveFilters && (
              <View className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary border border-background" />
            )}
          </View>
        )}

        <BottomSheetModal ref={sheetRef} index={0} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 px-4 pt-2 gap-4">
            <Text variant="h3">{capitalizeFirst(t("common.filters"))}</Text>

            {/* ── Creation Date ───────────────────────────────────── */}
            <Column gap={4}>
              <Text className="text-muted-foreground">
                {capitalizeFirst(t("common.creationDate"))}
              </Text>
              <Row gap={8}>
                <Column gap={4} className="flex-1">
                  <Label>{capitalizeFirst(t("common.startDate"))}</Label>
                  <DateInput
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="dd/mm/yyyy"
                    disableWebCalendar={true}
                  />
                </Column>
                <Column gap={4} className="flex-1">
                  <Label>{capitalizeFirst(t("common.endDate"))}</Label>
                  <DateInput
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="dd/mm/yyyy"
                    disableWebCalendar={true}
                  />
                </Column>
              </Row>
            </Column>
            {/* ── Action type ───────────────────────────────────── */}
            <Column gap={4} className={cn("flex-1", !isSmallWidth && "w-1/2")}>
              <Label>{capitalizeFirst(t("actions.actionType"))}</Label>
              <Select
                value={selectedActionType}
                onValueChange={(option) =>
                  setActionCategoryId(
                    option?.value ? String(option.value) : undefined,
                  )
                }
                className="flex-1"
              >
                <SelectTrigger className="w-full">
                  <Row gap={8}>
                    {selectedActionType?.icon && (
                      <Icon as={selectedActionType.icon} />
                    )}
                    <Text>
                      {selectedActionType
                        ? capitalizeFirst(t(selectedActionType.label))
                        : capitalizeFirst(t("common.selectOption"))}
                    </Text>
                  </Row>
                </SelectTrigger>
                <SelectContent>
                  {(["+", "-"] as const).map((rule) => (
                    <SelectGroup key={rule}>
                      <SelectLabel>
                        {capitalizeFirst(
                          t(rule === "+" ? "common.add" : "common.substract"),
                        )}{" "}
                        ({rule})
                      </SelectLabel>
                      {constants.actionTypes
                        .filter((a) => a.additionRule === rule)
                        .map((action) => (
                          <SelectItem
                            key={action.value}
                            value={String(action.value)}
                            label={capitalizeFirst(t(action.label))}
                          >
                            <Icon as={action.icon} />
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </Column>
            {/* ── Product code / Batch Number ──────────────────────────────────────────────── */}
            <Wrapper gap={8} className="mt-2">
              {/* ── Product code ──────────────────────────────────────────────── */}
              <View className="z-20 flex-1">
                <Label>{capitalizeFirst(t("actions.productCode"))}</Label>
                <AutocompleteInput
                  data={filteredProductCodes.map((s) => ({
                    label: s.product?.product_code ?? "",
                    value: s.product?.product_code ?? "",
                  }))}
                  value={productCode}
                  onChangeText={handleProductCodeChange}
                  onSelect={handleProductCodeSelect}
                  placeholder={capitalizeFirst(t("actions.productCode"))}
                />
              </View>

              {/* ── Batch number ──────────────────────────────────────────────── */}
              <View className="z-10 flex-1">
                <Label>{capitalizeFirst(t("actions.batchNumber"))}</Label>
                <AutocompleteInput
                  data={filteredBatchNumbers.map((s) => ({
                    label: s.batch_number ?? "",
                    value: s.batch_number ?? "",
                  }))}
                  value={batchNumber}
                  onChangeText={handleBatchNumberChange}
                  onSelect={handleBatchNumberSelect}
                  placeholder={capitalizeFirst(t("actions.batchNumber"))}
                />
              </View>
            </Wrapper>

            {/* ── Reset/Apply buttons ─────────────────────────────────────── */}
            <Row gap={8} className="mt-2 pb-4">
              <Button
                variant="outline"
                className="flex-1"
                onPress={handleReset}
              >
                {capitalizeFirst(t("common.reset"))}
              </Button>
              <Button className="flex-1" onPress={handleApply}>
                {capitalizeFirst(t("common.apply"))}
              </Button>
            </Row>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);
