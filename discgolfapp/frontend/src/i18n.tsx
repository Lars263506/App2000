import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const storedLanguage =
  typeof window !== 'undefined' && localStorage.getItem('language')
    ? localStorage.getItem('language') || 'no'
    : 'no';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: storedLanguage,
    fallbackLng: 'no',
    resources: {
      en: {
        translation: {
          navbar_logotext_norways: "Norway's",
          navbar_logotext_association: 'Discgolf Association',
        },
      },
      no: {
        translation: {
          navbar_logotext_norways: 'Norges',
          navbar_logotext_association: 'Discgolf-forbund',
        },
      },
    },
  });

export default i18next;
