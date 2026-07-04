import { SlidersHorizontal } from "lucide-react-native";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
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
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";
import { DateInput } from "../DateInput";

export type SortOption = {
  label: string;
  value: string;
};

export type TableFilterValue = {
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
};

export type TableFilterHandle = {
  present: () => void;
  dismiss: () => void;
};

type TableFilterProps = {
  sortOptions: SortOption[];
  defaultValue?: TableFilterValue;
  // Called when the user taps Apply. Wire this up to real
  // filter/sort state in the parent later.
  onApply?: (value: TableFilterValue) => void;
  // Called when the user taps Reset.
  onReset?: () => void;
  // If false, the built-in trigger button isn't rendered — useful if
  // you want to trigger `present()` from elsewhere (e.g. a Header slot)
  // via the ref instead.
  showTriggerButton?: boolean;
};

export const TableFilter = forwardRef<TableFilterHandle, TableFilterProps>(
  (
    { sortOptions, defaultValue, onApply, onReset, showTriggerButton = true },
    ref,
  ) => {
    const [t] = useTranslation();

    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["40%", "70%"], []);

    const [startDate, setStartDate] = useState<Date | undefined>(
      defaultValue?.startDate,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
      defaultValue?.endDate,
    );
    const [sortBy, setSortBy] = useState<string | undefined>(
      defaultValue?.sortBy,
    );

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const selectedSortOption = sortOptions.find((o) => o.value === sortBy);

    const handleApply = () => {
      onApply?.({
        startDate,
        endDate,
        sortBy,
      });
      sheetRef.current?.dismiss();
    };

    const handleReset = () => {
      setStartDate(undefined);
      setEndDate(undefined);
      setSortBy(undefined);
      onReset?.();
    };

    return (
      <>
        {showTriggerButton && (
          <Button variant="ghost" onPress={() => sheetRef.current?.present()}>
            <Icon as={SlidersHorizontal} />
          </Button>
        )}

        <BottomSheetModal ref={sheetRef} index={0} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 px-4 pt-2 gap-4">
            <Text variant="h3">{capitalizeFirst(t("common.filters"))}</Text>

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
                    disableWebCalendar={true} // Disable the web calendar to avoid issues with the popover in the bottom sheet
                  />
                </Column>
                <Column gap={4} className="flex-1">
                  <Label>{capitalizeFirst(t("common.endDate"))}</Label>
                  <DateInput
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="dd/mm/yyyy"
                    disableWebCalendar={true} // Disable the web calendar to avoid issues with the popover in the bottom sheet
                  />
                </Column>
              </Row>
            </Column>

            <Column gap={4} className="mt-2">
              <Label>{capitalizeFirst(t("common.sortBy"))}</Label>
              <Select
                value={
                  selectedSortOption
                    ? {
                        label: selectedSortOption.label,
                        value: selectedSortOption.value,
                      }
                    : undefined
                }
                onValueChange={(v) => setSortBy(v?.value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={capitalizeFirst(t("common.selectOption"))}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Column>

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
