import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
import axios from 'axios';
import { devConfig } from '@/devEnvConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPLE_API_KEY = devConfig.DEEPLE_API_KEY

const translationDir = path.resolve(__dirname, '../translations')

const translationRef = 'EN'

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const getFiles = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)


let supportedLanguages = [];

const fetchSupportedLanguages = async () => {
    try {
        const response = await axios.get('https://api-free.deepl.com/v2/languages', {
            params: {
                auth_key: DEEPLE_API_KEY,
                type: 'target'
            }
        });
        supportedLanguages = response.data.map(lang => lang.language);
    } catch (error) {
        console.error('Error fetching supported languages:', error);
    }
};

const isLanguageSupported = (lang) => {
    return supportedLanguages.includes(lang);
};

const translate = async (text, targetLang) => {

    if (!isLanguageSupported(targetLang)) {
        console.error(`Target language ${targetLang} is not supported by DeepL.`);
        return null;
    }

    try {
        const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
            params: {
                auth_key: DEEPLE_API_KEY,
                text: text,
                target_lang: targetLang,
                source_lang: translationRef
            }
        });
        return response.data.translations[0].text;
    } catch (error) {
        console.error('Error translating text:', error);
        return null;
    }
}

const updateMissingKeys = async (refObj, currentObj, targetLang) => {
    for (const key in refObj) {
        if (!currentObj.hasOwnProperty(key)) {
            if (typeof refObj[key] === 'object' && refObj[key] !== null) {
                currentObj[key] = {};
                await updateMissingKeys(refObj[key], currentObj[key], targetLang);
            } else {
                const translatedText = await translate(refObj[key], targetLang);
                if (translatedText) {
                    currentObj[key] = translatedText;
                }
            }
        } else if (typeof refObj[key] === 'object' && refObj[key] !== null) {
            await updateMissingKeys(refObj[key], currentObj[key], targetLang);
        }
    }
};

const updateTranslations = async () => {
    await fetchSupportedLanguages();
    const dirs = getDirectories(translationDir).filter(e => e != translationRef)
    const refFiles = getFiles(translationDir + path.sep + translationRef)

    for (const refFile of refFiles) {
        console.log(refFile)
        const refJson = JSON.parse(fs.readFileSync(translationDir + path.sep + translationRef + path.sep + refFile, 'utf8'));

        for (const dir of dirs) {
            if (!isLanguageSupported(dir)) {
                console.error(`Target language ${dir} is not supported by DeepL.`);
                continue;
            }

            const currentTranslationFile = translationDir + path.sep + dir + path.sep + refFile;
            if (!fs.existsSync(currentTranslationFile)) {
                fs.writeFileSync(currentTranslationFile, '{}', 'utf8');
            }
            const currentTranslationJson = JSON.parse(fs.readFileSync(currentTranslationFile, 'utf8'));

            await updateMissingKeys(refJson, currentTranslationJson, dir);

            fs.writeFileSync(currentTranslationFile, JSON.stringify(currentTranslationJson, null, 2), 'utf8');
            console.info(`All translations to ${dir} successfuly implemented.`)
        }
    }
}

updateTranslations().catch(error => console.error('Error updating translations:', error));
// await fetchSupportedLanguages();