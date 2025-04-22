import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface ForgotpasPageProps {
  togglePopup: () => void;
  setSelectedPage: (page: string) => void;
}

const ForgotpasPage: React.FC<ForgotpasPageProps> = ({ togglePopup, setSelectedPage }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Simulerer en "tilbakestillingslink" som sendes til e-post
    setTimeout(() => {
      toast.success(t('forgotpaspage_forgot_password_success'));
      setLoading(false);

      // Legg til en ekstra toast-melding før du blir sendt til login-siden
      toast.info(t('forgotpaspage_sendt_back', {
        autoClose: 2000, // Denne meldingen vises i 2 sekunder før navigering
      }));

      // Etter at toast-meldingen er vist, gå tilbake til hjem og åpne login-popupen
      setTimeout(() => {
        setSelectedPage('Home'); // Går til hjemmesiden
        togglePopup(); // Åpner login-popupen
      }, 2000); // Forsinkelse for at toast-meldingen skal vises før popupen åpnes
    }, 2000);
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-16 overflow-hidden">
      {/* Grå bakgrunnsboks med avrundede hjørner */}
      <div className="bg-gray-300 p-16 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="bg-white p-10 rounded-lg">
          {/* Plasserer overskriften til venstre */}
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

          {/* Legger til tekst under boksen */}
          <p className="mt-12 text-center text-base">
           {t('forgotpaspage_email')}{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setSelectedPage('Contact')}
            >
              {t('forgotpaspage_contact')}
            </span>
          </p>

          {/* Legger til lenke tilbake til innlogging */}
          <p className="mt-4 text-center text-base">
          {t('forgotpaspage_backto')} {' '} 
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setSelectedPage('Home'); // Går til hjemmesiden
                togglePopup(); // Åpner login-popupen
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
