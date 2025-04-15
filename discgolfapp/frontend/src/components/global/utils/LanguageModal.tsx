import React, { useEffect, useRef } from 'react';

import Button from '../Button';

interface LanguageModalProps {
  availableLanguages: string[];
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  availableLanguages,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const languageMap = new Intl.DisplayNames([selectedLanguage], { type: 'language' });

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Select Language</h2>
        <ul>
          {availableLanguages.map((language: string) => {
            const languageName: string = languageMap.of(language) || 'Unknown';

            return (
              <li key={language} className="mb-2 flex items-center">
                <img
                  src={`https://flagcdn.com/w320/${language === 'en' ? 'gb' : language}.png`}
                  alt={`${languageName.charAt(0).toUpperCase() + languageName.slice(1)} flag`}
                  className="w-6 h-4 mr-2"
                />
                <Button onClick={() => onSelectLanguage(language)}>
                  <span>
                    {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
        <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LanguageModal;
