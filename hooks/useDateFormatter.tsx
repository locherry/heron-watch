import { useTranslation } from "react-i18next";
import { format, Locale } from 'date-fns';
import { enUS, fr, de, es } from 'date-fns/locale'; // import the locales we need

// Map i18next language codes to date-fns locales
const localeMap: Record<string, Locale> = {
    'EN': enUS,
    'FR' : fr,
    // 'ES' : es,
    // 'DE' : de
    // add more as needed
};


export const useDateFormatter = () => {
    const { i18n } = useTranslation();
    return (date: string | Date) => {
        const lang = i18n.language.split('-')[0]; // e.g., 'en-US' -> 'en'
        const locale = localeMap[lang] || enUS;
        return format(new Date(date), 'Pp', { locale });
    };
};