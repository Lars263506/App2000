/**
 * Index Page Component
 * This file has been translated using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n';
import { toast, ToastContainer } from 'react-toastify';

import HomePage from '@/components/pages/HomePage';
import AdminPage from '@/components/pages/AdminPage';
import PlayPage from '@/components/pages/PlayPage';
import GetStartedPage from '@/components/pages/GetStartedPage';
import ClubLandingPage from '@/components/pages/ClubLandingPage';
import ClubPage from '@/components/pages/ClubPage';
import CoursePage from '@/components/pages/CoursePage';
import MyPage from '@/components/pages/MyPage';
import ContactPage from '@/components/pages/ContactPage';
import PrivacyPage from '@/components/pages/PrivacyPage';

import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import PopupWrapper from '@/components/global/PopupWrapper';
import { usePopup } from '@/components/global/UsePopup';

import validateSession from '@/utils/validate-session';

import { useTranslation } from 'react-i18next';

/**
 * @author Adrian Johansen
 * @description This is the main entry point for the application.
 * It manages the navigation between pages, handles translations, and initializes global components like the navbar, footer, and popups.
 * The component dynamically renders pages based on the selected state and fetches translations from the backend.
 * It also ensures session validation and persists the selected page across reloads.
 */

const Index = () => {
  const { t } = useTranslation();
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
  const [selectedPage, setSelectedPage] = useState('Home');
  const [loading, setLoading] = useState(true);

  const currentPage: { [key: string]: React.FC } = {
    'Home': () => <HomePage setSelectedPage={setSelectedPage} />,
    'Admin': () => <AdminPage setSelectedPage={setSelectedPage} />,
    'Play': () => <PlayPage />,
    'GetStarted': () => <GetStartedPage />,
    'Courses': () => <CoursePage />,
    'ClubLanding': () => <ClubLandingPage setSelectedPage={setSelectedPage} />,
    'Club': () => <ClubPage setSelectedPage={setSelectedPage} />,
    'MyPage': () => <MyPage setSelectedPage={setSelectedPage} />,
    'Contact': () => <ContactPage />,
    'Privacy': () => <PrivacyPage setSelectedPage={setSelectedPage} />,
  };

  useEffect(() => {
    validateSession()
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/translations/';
        const response = await fetch(url);
        if (response.status !== 200) throw new Error('Failed to fetch translations');
        const data: { language: string; key: string; translation: Record<string, string> | string }[] = await response.json();

        // Define the type for the accumulator
        const translations = data.reduce((acc: Record<string, { translation: Record<string, string> }>, item) => {
          if (!acc[item.language]) {
            acc[item.language] = { translation: {} };
          }

          // Check if the translation is an object
          if (typeof item.translation === 'object' && !Array.isArray(item.translation)) {
            // Flatten the object into individual keys
            Object.keys(item.translation).forEach((subKey) => {
              acc[item.language].translation[`${item.key}.${subKey}`] = (item.translation as Record<string, string>)[subKey];
            });
          } else {
            // Add the translation directly
            acc[item.language].translation[item.key] = item.translation as string;
          }

          return acc;
        }, {});

        // Add the translations to i18next
        Object.keys(translations).forEach((language) => {
          i18next.addResources(language, 'translation', translations[language].translation);
        });

        setLoading(false); // Mark translations as loaded
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(t('index_failed_to_fetch_translations'));
        }
        setLoading(false);
      }
    };

    const selectedPage = localStorage.getItem('selectedPage');
    if (selectedPage) {
      setSelectedPage(selectedPage);
    }

    fetchTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedPage', selectedPage);
  }, [selectedPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading_translations')}</p>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18next}>
      <div aria-label="Index root" className="flex flex-col min-h-screen overflow-x-hidden"
        onLoad={() => setSelectedPage(localStorage.getItem('selectedPage') || 'Home')}>
        <div aria-label="Navbar container" className="h-auto">
          <Navbar toggleLoginPopup={toggleLoginPopup} setSelectedPage={setSelectedPage} />
        </div>

        <div aria-label="Main content container" className="flex-grow">
          {currentPage[selectedPage] ? (
            React.createElement(currentPage[selectedPage])
          ) : (
            <HomePage setSelectedPage={setSelectedPage} />
          )}
        </div>

        <div aria-label="Footer container" className="mt-auto">
          <Footer setSelectedPage={setSelectedPage} />
        </div>

        <PopupWrapper
          popupType={popupType}
          closePopup={closePopup}
          toggleRegisterPopup={toggleRegisterPopup}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />

        <ToastContainer />
      </div>
    </I18nextProvider>
  );
};

export default Index;
