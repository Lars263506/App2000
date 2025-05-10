import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.

The translations are located in the database and will be loaded from there when web application is refreshed.
*/

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
