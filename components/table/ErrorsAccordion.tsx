import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  console.log(nb_items);
  return (
    <Accordion type="single" defaultValue="item-1" collapsible={true}>
      <FlatList
        data={data?.filter(
          (item) => item.action?.product?.product_code != null,
        )}
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
                      t("error_management_menu.not_found"),
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
