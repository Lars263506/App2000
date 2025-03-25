import Translation from '../../../types/translation';

const getTranslation = (variable: string, language: string = 'no'): string => {
    const storedTranslations = localStorage.getItem('translations');
    if (!storedTranslations) {
        return 'Translation not found';
    }

    const translations: Translation[] = JSON.parse(storedTranslations);
    const translation = translations.find(t => t.variable === variable);
    return translation?.translations[language] || 'Translation not found';
};

export default getTranslation;