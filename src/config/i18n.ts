import i18n from 'i18n';
import path from 'path';

i18n.configure({
    locales:['en','kiny'],
    defaultLocale:'en',
    directory:path.join(__dirname,'../locales'),
    objectNotation:true,
    updateFiles:false,
    autoReload:process.env.NODE_ENV!=='production',
    queryParameter: 'lang',
    cookie:'locale',
})
export default i18n;