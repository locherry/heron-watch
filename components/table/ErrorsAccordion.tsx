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
import { Text } from '../ui/text';
export function ErrorsAccordion({data, stockCategory} : {data : {product_code? : string | undefined}[] | undefined, stockCategory : StockCategory}) {
    const [t] = useTranslation();
    //We get actual stock category

    return (
        <Accordion type="single" className='w-full' defaultValue="item-1">
            <FlatList 
            data = {data}
            keyExtractor={(item) => (item.product_code ?? "1")}
            renderItem = {({item, index}) => (
                <AccordionItem value={"item-".concat(String(index))}>
                    <AccordionTrigger>
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
            )}
            />
        </Accordion>
    );
}