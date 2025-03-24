import React, { useEffect, useState } from 'react'

interface Translation {
  variable: string
  deactivated: boolean
  translations: { [language: string]: string }
}

interface Language {
  code: string
  deactivated: boolean
}

const initialTranslations: Translation[] = [
  { variable: 'greeting', deactivated: false, translations: { en: 'Hello', es: 'Hola', fr: 'Bonjour' } },
  { variable: 'farewell', deactivated: false, translations: { en: 'Goodbye', es: 'Adiós', fr: 'Au revoir' } },
];

const initialLanguages: Language[] = [
  { code: 'en', deactivated: false },
  { code: 'es', deactivated: false },
  { code: 'fr', deactivated: false },
];

const TranslationDetails = () => {
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations)
  const [languages, setLanguages] = useState<Language[]>(initialLanguages)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    fetchTranslations()
  }, [])

  useEffect(() => {
    localStorage.setItem('translations', JSON.stringify(translations))
  }, [translations])

  const fetchTranslations = async () => {
    setTranslations(localStorage.getItem('translations') 
      ? JSON.parse(localStorage.getItem('translations')!) 
      : [])
  }

  const handleVariableChange = (index: number, newVariable: string) => {
    const newTranslations = [...translations]
    newTranslations[index].variable = newVariable
    setTranslations(newTranslations)
  };

  const handleTranslationChange = (index: number, language: string, newValue: string) => {
    const newTranslations = [...translations]
    newTranslations[index].translations[language] = newValue
    setTranslations(newTranslations)
  };

  const addLanguage = (newLanguage: string) => {
    if (!newLanguage) {
      alert('Please enter a language code')
      return
    }

    const existingLanguage = languages.find(lang => lang.code === newLanguage)

    if (existingLanguage) {
      existingLanguage.deactivated = false
      setLanguages([...languages])
    } else {
      setLanguages([...languages, { code: newLanguage, deactivated: false }])
      const updatedTranslations = translations.map(translation => ({
        ...translation,
        translations: { ...translation.translations, [newLanguage]: '' },
      }));
      setTranslations(updatedTranslations)
    }
  };

  const deactivateLanguage = (languageToDeactivate: string) => {
    const updatedLanguages = languages.map(lang =>
      lang.code === languageToDeactivate ? { ...lang, deactivated: true } : lang
    );
    setLanguages(updatedLanguages)
  };

  const addVariable = (newVariable: string) => {
    if (!newVariable) {
      alert('Please enter a variable name')
      return
    }

    const existingVariable = translations.find(translation => translation.variable === newVariable)

    if (existingVariable) {
      existingVariable.deactivated = false
      setTranslations([...translations])
    } else {
      setTranslations([...translations, { variable: newVariable, deactivated: false, translations: {} }])
    }
  };

  const deactivateVariable = (variableToDeactivate: string) => {
    const updatedTranslations = translations.map(translation =>
      translation.variable === variableToDeactivate ? { ...translation, deactivated: true } : translation
    );
    setTranslations(updatedTranslations)
  };

  const filteredTranslations = translations
    .filter(translation => !translation.deactivated)
    .filter(translation => {
      const variableMatches = translation.variable.toLowerCase().includes(filter.toLowerCase())
      const translationMatches = Object.values(translation.translations).some(value =>
        value.toLowerCase().includes(filter.toLowerCase())
      );
      return variableMatches || translationMatches
    });

  return (
    <div aria-label="Translation details root">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter variables"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Variable</th>
            {languages.filter(lang => !lang.deactivated).map(language => (
              <th key={language.code} className="py-2 px-4 border-b">
                {language.code}
                <button onClick={() => deactivateLanguage(language.code)} className="ml-2 text-red-500">x</button>
              </th>
            ))}
            <th className="py-2 px-4 border-b">
              <button 
              onClick={() => addLanguage(prompt('Enter new language code:') || '')} 
              className="text-green-500"
              >
                + Add Language
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTranslations
            .sort((a, b) => a.variable.localeCompare(b.variable))
            .map((translation, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b flex items-center">
                  <input
                    type="text"
                    value={translation.variable}
                    onChange={e => handleVariableChange(index, e.target.value)}
                    className="w-full border p-1"
                  />
                  <button onClick={() => deactivateVariable(translation.variable)} className="ml-2 text-red-500">x</button>
                </td>
                {languages.filter(lang => !lang.deactivated).map(language => (
                  <td key={language.code} className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={translation.translations[language.code] || ''}
                      onChange={e => handleTranslationChange(index, language.code, e.target.value)}
                      className="w-full border p-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => addVariable(prompt('Enter new variable name:') || '')}
          className="py-2 px-4 border-b text-green-500"
        >
          + Add variable
        </button>
      </div>
    </div>
  )
}

export default TranslationDetails