import mainEn from '../translations/EN/main.json'
// import errorMsgEn from '../translations/EN/errorMsg.json'

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS : 'main',
        ressources : {
            main : typeof mainEN,
            // errorMsg : typeof errorMsgEn,
        }
    }
}