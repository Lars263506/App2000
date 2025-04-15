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

import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';
import PopupWrapper from '@/components/global/popupwrapper';
import { usePopup } from '@/components/global/usepopup';

import validateSession from '@/utils/validateSession';

const Index = () => {
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
        const data = await response.json();

        // Transform the list into the correct format for i18next
        const translations = data.reduce((acc: any, item: any) => {
          if (!acc[item.language]) {
            acc[item.language] = { translation: {} };
          }

          // Check if the translation is an object
          if (typeof item.translation === 'object' && !Array.isArray(item.translation)) {
            // Flatten the object into individual keys
            Object.keys(item.translation).forEach((subKey) => {
              acc[item.language].translation[`${item.key}.${subKey}`] = item.translation[subKey];
            });
          } else {
            // Add the translation directly
            acc[item.language].translation[item.key] = item.translation;
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
          toast.error('Failed to fetch translations');
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
        <p>Loading translations...</p>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18next}>
      <div aria-label="Index root" className="flex flex-col min-h-screen"
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
          setSelectedPage={setSelectedPage}
        />

        <ToastContainer />
      </div>
    </I18nextProvider>
  );
};

export default Index;
