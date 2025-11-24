import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';
import { FlatList } from "react-native";
import { StockCategory } from '~/@types/stock';
import { ErrorsTable } from '~/components/table/ErrorsTable';
import { capitalizeFirst } from '~/lib/utils';
import { Separator } from '../ui/separator';
import { Text } from '../ui/text';
export function ErrorsAccordion({data, stockCategory, className} : {data : {product_code? : string | undefined}[] | undefined, stockCategory : StockCategory, className? : string}) {
    const [t] = useTranslation();
    //We get actual stock category

    //Count number of displayed items to disable separator when we arrive at the end
    const nb_items = data?.length ?? 0;
    console.log(nb_items);
    return (
        <Accordion type="single" defaultValue="item-1" collapsible={true}>
            <FlatList 
            data = {data}
            keyExtractor={(item) => (item.product_code ?? "1")}
            renderItem = {({item, index}) => (
                <>
                <AccordionItem value={"item-".concat(String(index))}>
                    <AccordionTrigger className='mx-10' >
                        <Text>
                            {capitalizeFirst(item.product_code ?? t("error_management_menu.not_found"))}
                        </Text>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ErrorsTable
                            product_code={item.product_code}
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