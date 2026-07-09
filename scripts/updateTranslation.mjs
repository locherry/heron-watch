import axios from 'axios';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPLE_API_KEY = process.env.EXPO_PUBLIC_DEEPLE_API_KEY

const translationDir = path.resolve(__dirname, '../translations')

const translationRef = 'EN'

const sortObjectKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }
    return Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .reduce((sorted, key) => {
            sorted[key] = sortObjectKeys(obj[key]);
            return sorted;
        }, {});
};

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
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPLE_API_KEY}`,
            },
            params: {
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

const translate = async (text, targetLang, retries = 5) => {
    if (!isLanguageSupported(targetLang)) {
        console.error(`Target language ${targetLang} is not supported by DeepL.`);
        return null;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
                headers: {
                    'Authorization': `DeepL-Auth-Key ${DEEPLE_API_KEY}`,
                },
                params: {
                    text: text,
                    target_lang: targetLang,
                    source_lang: translationRef
                }
            });
            return response.data.translations[0].text;
        } catch (error) {
            if (error.response?.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, attempt);
                console.warn(`Rate limited by DeepL. Waiting ${waitMs}ms (attempt ${attempt + 1}/${retries})...`);
                await new Promise(res => setTimeout(res, waitMs));
                continue;
            }
            console.error('Error translating text:', error.message);
            return null;
        }
    }
    console.error(`Failed to translate after ${retries} retries: "${text}"`);
    return null;
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

const removeExtraKeys = (refObj, currentObj) => {
    for (const key in currentObj) {
        if (!refObj.hasOwnProperty(key)) {
            delete currentObj[key];
        } else if (typeof refObj[key] === 'object' && refObj[key] !== null) {
            if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                removeExtraKeys(refObj[key], currentObj[key]);
            } else {
                delete currentObj[key];
            }
        }
    }
};

const updateTranslations = async () => {
    await fetchSupportedLanguages();
    const dirs = getDirectories(translationDir).filter(e => e != translationRef)
    const refFiles = getFiles(translationDir + path.sep + translationRef)

    for (const refFile of refFiles) {
        const refPath = translationDir + path.sep + translationRef + path.sep + refFile;
        const refJson = JSON.parse(fs.readFileSync(refPath, 'utf8'));

        const sortedRefJson = sortObjectKeys(refJson);
        fs.writeFileSync(refPath, JSON.stringify(sortedRefJson, null, 2), 'utf8');

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

            await updateMissingKeys(sortedRefJson, currentTranslationJson, dir);
            removeExtraKeys(sortedRefJson, currentTranslationJson);

            const sortedTranslationJson = sortObjectKeys(currentTranslationJson);

            fs.writeFileSync(currentTranslationFile, JSON.stringify(sortedTranslationJson, null, 2), 'utf8');
            console.info(`All translations to ${dir} successfuly implemented.`)
        }
    }
}

updateTranslations().catch(error => console.error('Error updating translations:', error));
