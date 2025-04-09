import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const storedLanguage =
  typeof window !== 'undefined' && localStorage.getItem('selectedLanguage')
    ? localStorage.getItem('selectedLanguage') || 'no'
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
        },
      },
      no: {
        translation: {
        },
      },
    },
  });

export default i18next;
