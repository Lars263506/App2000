import React, { useState, useEffect } from 'react';
import Translation from '../../../types/translation';

interface UseTranslationProps {
    variable: string;
}

const UseTranslation: React.FC<UseTranslationProps> = ({ variable }) => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('no');
    const [translationValue, setTranslationValue] = useState<string>('Translation not found');

    useEffect(() => {
        const storedTranslations = localStorage.getItem('translations');
        if (storedTranslations) {
            const parsedTranslations = JSON.parse(storedTranslations);
            setTranslations(parsedTranslations);
            const translation = parsedTranslations.find(
                (t: Translation) => t.variable === variable
            );
            if (translation) {
                setTranslationValue(translation.translations[selectedLanguage] || 'Translation not found');
            }
        }
    }, [variable, selectedLanguage]);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('selectedLanguage');
        if (storedLanguage) {
            setSelectedLanguage(storedLanguage);
        }
    }, []);

    return (
        <div>
            {translationValue}
        </div>
    );
}

export default UseTranslation;