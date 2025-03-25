import React from 'react';

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Select Language</h2>
        <ul>
          {availableLanguages.map((language) => (
            <li key={language} className="mb-2">
              <button
                className={`p-2 rounded ${language === selectedLanguage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => onSelectLanguage(language)}
              >
                {language}
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LanguageModal;