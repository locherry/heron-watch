import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import { ApiResponse } from "~/@types/api";
import { StockCategory } from "~/@types/stock";
import { ErrorsTable } from "~/components/table/ErrorsTable";
import { capitalizeFirst } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";

export function ErrorsAccordion({
  data,
  stockCategory,
  className,
}: {
  data: ApiResponse<"/api/known_errors", "get">["member"] | undefined;
  stockCategory: StockCategory;
  className?: string;
}) {
  const [t] = useTranslation();
  //We get actual stock category

  //Count number of displayed items to disable separator when we arrive at the end
  const nb_items = data?.length ?? 0;

  // Temp fix may be a backend issue, we filter out duplicates by product code to avoid displaying the same product multiple times in the accordion
  const uniqueByProductCode = useMemo(() => {
    const seen = new Set<string>();
    return (data ?? []).filter((item) => {
      const code = item.action?.product?.product_code;
      if (!code || seen.has(code)) return false;
      seen.add(code);
      return true;
    });
  }, [data]);
  return (
    <Accordion type="single" defaultValue="item-1" collapsible={true}>
      <FlatList
        data={uniqueByProductCode}
        keyExtractor={(item) =>
          item.action?.product.product_code + item.action?.batch_number
        }
        renderItem={({ item, index }) => (
          <>
            <AccordionItem value={"item-".concat(String(index))}>
              <AccordionTrigger className="mx-10">
                <Text>
                  {capitalizeFirst(
                    item.action?.product.product_code ??
                      t("errorManagementMenu.notFound"),
                  )}
                </Text>
              </AccordionTrigger>
              <AccordionContent>
                <ErrorsTable
                  product_code={item.action?.product.product_code}
                  stockCategory={stockCategory}
                />
              </AccordionContent>
            </AccordionItem>
            {index != nb_items - 1 ? <Separator /> : <></>}
          </>
        )}
      />
    </Accordion>
  );
}
