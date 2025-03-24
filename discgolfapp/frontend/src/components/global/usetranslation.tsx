import React, { useState } from 'react';
import Translation from '../../types/translation';

interface UseTranslationProps {
    variable: string;
}

const UseTranslation: React.FC<UseTranslationProps> = ({ variable }) => {
    const [translations, setTranslations] = useState<Translation[]>(() => {
        const storedTranslations = localStorage.getItem('translations');
        return storedTranslations ? JSON.parse(storedTranslations) : [];
    });

    const [selectedLanguage, setSelectedLanguage] = useState<string>(
        localStorage.getItem('selectedLanguage') || 'no'
    );

    const translationValue = translations.find(
        translation => translation.variable === variable
    )?.translations[selectedLanguage];

    return (
        <div>
            {translationValue || 'Translation not found'}
        </div>
    );
}

export default UseTranslation;