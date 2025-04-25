/**
 * PrivacyPage Component
 * Displays the privacy policy information for the application.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

/**
 * Props for the PrivacyPage component
 * @typedef {Object} PrivacyProps
 * @property {function(string): void} setSelectedPage - Function to set the selected page.
 * @author Andreas Nilsen
 */

import React from 'react';

import { useTranslation } from 'react-i18next';

/**
 * @author 
 * @description This component renders the Privacy Policy page for the application.
 * It displays detailed information about data usage, user rights, and privacy practices.
 * The page uses translations for all text and includes a button to navigate to the Contact page.
 * The content is styled for readability and responsiveness.
 */

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

interface PrivacyProps {
  setSelectedPage: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyProps> = ({ setSelectedPage }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-8 max-w-4xl mx-auto">
        <div className="bg-[#E7EFFB] p-6 rounded-2xl shadow-md">
          {/* Hvit innholdsboks */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">{t('privacypage_personal')}</h1>

            <p className="mb-4">
              {t('privacypage_intro')}
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text1')}</h2>
            <p className="mb-4">
              {t('privacypage_text1')}
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text2')}</h2>
            <p className="mb-4">{t('privacypage_header_text2_1')}</p>
            <ul className="list-disc list-inside mb-4">
              <li>{t('privacypage_text2_1')}</li>
              <li>{t('privacypage_text2_2')}</li>
              <li>{t('privacypage_text2_3')}</li>
              <li>{t('privacypage_text2_4')}</li>
              <li>{t('privacypage_text2_5')}</li>
            </ul>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text3')}</h2>
            <p className="mb-4">
              {t('privacypage_text3')}
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text4')}</h2>
            <p className="mb-4">{t('privacypage_header_text4_1')}</p>
            <ul className="list-disc list-inside mb-4">
              <li>{t('privacypage_text4_1')}</li>
              <li>{t('privacypage_text4_2')}</li>
              <li>{t('privacypage_text4_3')}</li>
              <li>{t('privacypage_text4_4')}</li>
              <li>{t('privacypage_text4_5')}</li>
            </ul>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text5')}</h2>
            <p className="mb-4">
              {t('privacypage_header_text5_1')}
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">{t('privacypage_header_text6')}</h2>
            <p className="mb-4">
              {t('privacypage_header_text6_1')}
            </p>

            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedPage('Contact')}
                className="bg-[#1B365D] text-white py-2 px-6 rounded-md hover:bg-[#5A8FCC] transition-colors duration-300"
              >
                {t('privacypage_header_text7')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
