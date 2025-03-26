import React, { useEffect, useState } from 'react';
import { v4 as uuid4 } from 'uuid';
import { toast } from 'react-toastify';

import getTranslation from '../global/utils/gettranslation';
import UseTranslation from '../global/utils/usetranslation';
import Translation from '../../types/translation';

import useFetch from '../global/utils/usefetch';

interface Language {
  code: string;
  deactivated: boolean;
}

const TranslationDetails = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filter, setFilter] = useState<string>('');

  const { error, fetch } = useFetch({
    endpoint: '/translations',
    method: 'PUT',
    body: translations,
    expectedStatus: 204,
    customErrorMessage: 'Failed to update translations',
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    localStorage.getItem('selectedLanguage') || 'no'
  );

  const updateTranslations = async () => {
    await fetch();
    if (error) toast.error(error);
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('translations', JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    const allLanguages = new Set<string>();

    translations.forEach((translation) => {
      Object.keys(translation.translations).forEach((language) => {
        allLanguages.add(language);
      });
    });

    const updatedLanguages = Array.from(allLanguages).map((code) => ({
      code,
      deactivated: languages.find((lang) => lang.code === code)?.deactivated || false,
    }));

    setLanguages(updatedLanguages);
  }, [translations]);

  const fetchTranslations = async () => {
    setTranslations(localStorage.getItem('translations')
      ? JSON.parse(localStorage.getItem('translations')!)
      : []);
  };

  const handleVariableChange = (id: string, newVariable: string) => {
    const newTranslations = translations.map((translation) =>
      translation.id === id ? { ...translation, variable: newVariable } : translation
    );
    setTranslations(newTranslations);
  };

  const handleTranslationChange = (id: string, language: string, newValue: string) => {
    const newTranslations = translations.map((translation) =>
      translation.id === id
        ? { ...translation, translations: { ...translation.translations, [language]: newValue } }
        : translation
    );
    setTranslations(newTranslations);
  };

  const addLanguage = (newLanguage: string) => {
    if (!newLanguage) {
      alert('Please enter a language code');
      return;
    }

    const existingLanguage = languages.find((lang) => lang.code === newLanguage);

    if (existingLanguage) {
      existingLanguage.deactivated = false;
      setLanguages([...languages]);
      alert('Language already exists, if it was deactivated it is now active again');
    } else {
      setLanguages([...languages, { code: newLanguage, deactivated: false }]);
      const updatedTranslations = translations.map((translation) => ({
        ...translation,
        translations: { ...translation.translations, [newLanguage]: '' },
      }));
      setTranslations(updatedTranslations);
    }
  };

  const deactivateLanguage = (languageToDeactivate: string) => {
    const updatedLanguages = languages.map((lang) =>
      lang.code === languageToDeactivate ? { ...lang, deactivated: true } : lang
    );
    setLanguages(updatedLanguages);
  };

  const addVariable = (newVariable: string) => {
    if (!newVariable) {
      alert('Please enter a variable name');
      return;
    }

    const existingVariable = translations.find((translation) => translation.variable === newVariable);

    if (existingVariable) {
      existingVariable.deactivated = false;
      setTranslations([...translations]);
    } else {
      setTranslations([
        ...translations,
        { id: uuid4(), variable: newVariable, deactivated: false, translations: {} },
      ]);
    }
  };

  const deactivateVariable = (variableToDeactivate: string) => {
    const updatedTranslations = translations.map((translation) =>
      translation.variable === variableToDeactivate ? { ...translation, deactivated: true } : translation
    );
    setTranslations(updatedTranslations);
  };

  const filteredTranslations = translations
    .filter((translation) => !translation.deactivated)
    .filter((translation) => {
      const variableMatches = translation.variable.toLowerCase().includes(filter.toLowerCase());
      const translationMatches = Object.values(translation.translations).some((value) =>
        value.toLowerCase().includes(filter.toLowerCase())
      );
      return variableMatches || translationMatches;
    });

  const clearDeactivatedTranslations = () => {
    if (window.confirm(getTranslation('adminpage_settings_cleardeactivated_warning1', selectedLanguage))) {
      if (window.confirm(getTranslation('adminpage_settings_cleardeactivated_warning2', selectedLanguage))) {
        const activeTranslations = translations.filter((translation) => !translation.deactivated);
        setTranslations(activeTranslations);
        localStorage.setItem('translations', JSON.stringify(activeTranslations));
      }
    }
  };

  return (
    <div aria-label="Translation details root">
      <div className="mb-4 overflow-scroll-auto">
        <input
          type="text"
          placeholder="Filter variables"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              <UseTranslation variable="adminpage_settings_variableheader" />
            </th>
            {languages.filter((lang) => !lang.deactivated).map((language) => (
              <th key={language.code} className="py-2 px-4 border-b">
                {language.code}
                <button
                  onClick={() => deactivateLanguage(language.code)}
                  className="ml-2 text-red-500"
                >
                  x
                </button>
              </th>
            ))}
            <th className="py-2 px-4 border-b">
              <button
                onClick={() => addLanguage(prompt('Enter new language code:') || '')}
                className="text-green-500"
              >
                <UseTranslation variable="adminpage_settings_addlanguage" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTranslations
            .sort((a, b) => a.variable.localeCompare(b.variable))
            .map((translation) => (
              <tr key={translation.id}>
                <td className="py-2 px-4 flex items-center">
                  <input
                    type="text"
                    value={translation.variable}
                    onChange={(e) => handleVariableChange(translation.id, e.target.value)}
                    className="w-full border p-1"
                  />
                  <button
                    onClick={() => deactivateVariable(translation.variable)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </td>
                {languages.filter((lang) => !lang.deactivated).map((language) => (
                  <td key={language.code} className="py-2 px-4">
                    <input
                      type="text"
                      value={translation.translations[language.code] || ''}
                      onChange={(e) =>
                        handleTranslationChange(translation.id, language.code, e.target.value)
                      }
                      className="w-full border p-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <div className="py-2 px-4 bg-white">
        <button
          onClick={() => addVariable(prompt('Enter new variable name:') || '')}
          className="text-green-500"
        >
          <UseTranslation variable="adminpage_settings_addvariable" />
        </button>
        <button onClick={clearDeactivatedTranslations} className="ml-2 text-red-500">
          <UseTranslation variable="adminpage_settings_cleardeactivated" />
        </button>
        <button onClick={updateTranslations} className="ml-2">
          <UseTranslation variable="adminpage_settings_savetranslations" />
        </button>
      </div>
    </div>
  );
};

export default TranslationDetails;