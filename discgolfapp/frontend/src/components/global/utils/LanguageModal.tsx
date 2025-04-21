import React, { useEffect, useRef } from 'react';

interface LanguageModalProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const availableLanguages = [ 'no', 'en'];
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
    <div
      ref={modalRef}
      className="absolute top-18 left-[50%] bg-white border border-gray-300 rounded shadow-lg w-48 z-50"
    >
      <ul className="py-2">
        {availableLanguages.map((language: string) => {
          const languageName: string = languageMap.of(language) || 'Unknown';

          return (
            <li
              key={language}
              className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => onSelectLanguage(language)}
            >
              <img
                src={`https://flagcdn.com/w320/${language === 'en' ? 'gb' : language}.png`}
                alt={`${languageName.charAt(0).toUpperCase() + languageName.slice(1)} flag`}
                className="w-6 h-4 mr-2"
              />
              <span>{languageName.charAt(0).toUpperCase() + languageName.slice(1)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageModal;
