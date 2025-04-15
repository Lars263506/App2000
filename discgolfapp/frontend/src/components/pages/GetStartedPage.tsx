'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const GetStartedPage = () => {
  const { t, i18n } = useTranslation();

  const [selectedInfo, setSelectedInfo] = useState<'beginner' | 'advanced' | 'rules'>('beginner');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editableTips, setEditableTips] = useState<{ [key: string]: string[] }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sjekk om brukeren er admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        toast.error('Kunne ikke sjekke admin-status.');
      }
    };

    checkAdminStatus();
  }, []);

  // Initialiser redigerbare tips
  useEffect(() => {
    setEditableTips({
      beginner: t('getstarted_beginner_tips', { returnObjects: true }) as string[],
      advanced: t('getstarted_advanced_tips', { returnObjects: true }) as string[],
      rules: t('getstarted_rules_list', { returnObjects: true }) as string[],
    });
  }, [t]);

  // Håndter endringer i listepunkter
  const handleTipChange = (category: string, index: number, value: string) => {
    setEditableTips((prev) => {
      const updated = { ...prev };
      updated[category][index] = value;
      return updated;
    });
    setHasChanges(true);
  };

  // Legg til et nytt listepunkt
  const addTip = (category: string) => {
    setEditableTips((prev) => {
      const updated = { ...prev };
      updated[category] = [...(updated[category] || []), ''];
      return updated;
    });
    setHasChanges(true);
  };

  const removeTip = async (category: string, index: number) => {
    try {
      // Oppdater frontend først
      setEditableTips((prev) => {
        const updated = { ...prev };
        updated[category] = updated[category].filter((_, i) => i !== index);
        return updated;
      });
      setHasChanges(true);
    } catch (error) {
      toast.error('Kunne ikke fjerne listepunkt.');
    }
  };

  // Lagre endringer til backenden
  const saveChanges = async () => {
    try {
      // Generer oppdateringer med riktig index
      const updates = Object.entries(editableTips).flatMap(([category, tips]) =>
        tips.map((tip, index) => ({
          language: i18n.language,
          key: category === "rules" ? `getstarted_rules_list` : `getstarted_${category}_tips`,
          index, // Bruk indeksen fra map
          translation: tip,
        }))
      );

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/translations/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.status !== 200)
        throw new Error('Kunne ikke lagre endringer.');

      toast.success('Endringer lagret!');
      setHasChanges(false);
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
      else
        toast.error('Kunne ikke lagre endringer.');
    }
  };

  return (
    <div className="flex flex-col mt-24">
      <div className="flex-grow flex flex-col items-center justify-center pb-8">
        <div className="max-w-4xl w-full p-8 rounded-lg shadow-lg text-center bg-[#E7EFFB]">
          <h1 className="text-2xl font-bold text-[#1B365D] mb-4">{t('getstarted_title')}</h1>
          <p className="text-[#2A4470] mb-6">{t('getstarted_choose')}</p>

          {/* Knappene for å velge nivå */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setSelectedInfo('beginner')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                selectedInfo === 'beginner' ? 'bg-[#1B365D]' : 'bg-gray-400'
              }`}
            >
              {t('getstarted_beginnerbutton')}
            </button>
            <button
              onClick={() => setSelectedInfo('advanced')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                selectedInfo === 'advanced' ? 'bg-[#1B365D]' : 'bg-gray-400'
              }`}
            >
              {t('getstarted_advancedbutton')}
            </button>
            <button
              onClick={() => setSelectedInfo('rules')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                selectedInfo === 'rules' ? 'bg-[#1B365D]' : 'bg-gray-400'
              }`}
            >
              {t('getstarted_rulesbutton')}
            </button>
          </div>

          {/* Innholdet som skifter basert på valg */}
          <div className="text-left bg-white p-6 rounded-lg shadow-md">
            {selectedInfo === 'beginner' && (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">{t('getstarted_beginner_title')}</h2>
                <p className="text-[#2A4470] mb-4">{t('getstarted_beginner_description')}</p>
                <ul className="list-disc pl-5 text-[#2A4470] space-y-2">
                  {editableTips.beginner?.map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {isAdmin ? (
                        <>
                          <textarea
                            className="w-full p-2 border rounded"
                            value={tip}
                            onChange={(e) => handleTipChange('beginner', index, e.target.value)}
                          />
                          <button
                            onClick={() => removeTip('beginner', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Fjern
                          </button>
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: tip }}></span>
                      )}
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <button
                    onClick={() => addTip('beginner')}
                    className="mt-4 bg-[#1B365D] text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Legg til punkt
                  </button>
                )}
              </div>
            )}

            {selectedInfo === 'advanced' && (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">{t('getstarted_advanced_title')}</h2>
                <p className="text-[#2A4470] mb-4">{t('getstarted_advanced_description')}</p>
                <ul className="list-disc pl-5 text-[#2A4470] space-y-2">
                  {editableTips.advanced?.map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {isAdmin ? (
                        <>
                          <textarea
                            className="w-full p-2 border rounded"
                            value={tip}
                            onChange={(e) => handleTipChange('advanced', index, e.target.value)}
                          />
                          <button
                            onClick={() => removeTip('advanced', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Fjern
                          </button>
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: tip }}></span>
                      )}
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <button
                    onClick={() => addTip('advanced')}
                    className="mt-4 bg-[#1B365D] text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Legg til punkt
                  </button>
                )}
              </div>
            )}

            {selectedInfo === 'rules' && (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">{t('getstarted_rules_title')}</h2>
                <p className="text-[#2A4470] mb-4">{t('getstarted_rules_description')}</p>
                <ul className="list-disc pl-5 text-[#2A4470] space-y-2">
                  {editableTips.rules?.map((rule, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {isAdmin ? (
                        <>
                          <textarea
                            className="w-full p-2 border rounded"
                            value={rule}
                            onChange={(e) => handleTipChange('rules', index, e.target.value)}
                          />
                          <button
                            onClick={() => removeTip('rules', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Fjern
                          </button>
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: rule }}></span>
                      )}
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <button
                    onClick={() => addTip('rules')}
                    className="mt-4 bg-[#1B365D] text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Legg til punkt
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lagre-knapp */}
      {isAdmin && hasChanges && (
        <button
          onClick={saveChanges}
          className="fixed bottom-4 right-4 bg-[#1B365D] text-white px-6 py-2 rounded-lg shadow-lg"
        >
          Lagre endringer
        </button>
      )}
    </div>
  );
};

export default GetStartedPage;
