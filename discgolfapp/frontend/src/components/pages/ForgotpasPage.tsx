/**
 * ForgotpasPage Component
 * Provides a password reset interface for users, including functionality to send a reset link to the user's email.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * Props for the ForgotpasPage component
 * @typedef {Object} ForgotpasPageProps
 * @property {function(): void} togglePopup - Function to toggle the login popup.
 * @property {function(string): void} setSelectedPage - Function to set the selected page.
 * @author Andreas Nilsen
 */

interface ForgotpasPageProps {
  togglePopup: () => void;
  setSelectedPage: (page: string) => void;
}

const ForgotpasPage: React.FC<ForgotpasPageProps> = ({ togglePopup, setSelectedPage }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles the password reset process, including simulating an email reset link and navigation.
   * Displays success and informational messages during the process.
   * 
   * @function handlePasswordReset
   * @param {React.FormEvent} event - The form submission event.
   * @returns {Promise<void>}
   * @author Andreas Nilsen
   */
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success(t('forgotpaspage_forgot_password_success'));
      setLoading(false);

      toast.info(t('forgotpaspage_sendt_back', {
        autoClose: 2000, 
      }));

      setTimeout(() => {
        setSelectedPage('Home'); 
        togglePopup(); 
      }, 2000); 
    }, 2000);
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-16 overflow-hidden">
      <div className="bg-gray-300 p-16 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="bg-white p-10 rounded-lg">
          <h2 className="text-3xl font-bold text-left mb-12">{t('forgotpaspage_password')}</h2>
          <form onSubmit={handlePasswordReset} className="flex flex-col space-y-4">
            <input
              type="email"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Skriv inn e-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sender e-post...' : 'Tilbakestill passord'}
            </button>
          </form>

          <p className="mt-12 text-center text-base">
           {t('forgotpaspage_email')}{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setSelectedPage('Contact')}
            >
              {t('forgotpaspage_contact')}
            </span>
          </p>

          <p className="mt-4 text-center text-base">
          {t('forgotpaspage_backto')} {' '} 
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setSelectedPage('Home'); 
                togglePopup(); 
              }}
            >
              {t('forgotpaspage_back')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotpasPage;
