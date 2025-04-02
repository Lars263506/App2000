import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n';
import { ToastContainer } from 'react-toastify';

import Home from '@/components/pages/Home';
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

const Index = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
  const [selectedPage, setSelectedPage] = useState('Home');

  const currentPage: { [key: string]: React.FC } = {
    'Home': () => <Home setSelectedPage={setSelectedPage} />,
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

  // Load selected page from local storage on page load
  useEffect(() => {
    const selectedPage = localStorage.getItem('selectedPage');
    if (selectedPage) {
      setSelectedPage(selectedPage);
    }
  }, []);

  // Save selected page to local storage on change
  useEffect(() => {
    localStorage.setItem('selectedPage', selectedPage);
  }, [selectedPage]);

  return (
    <I18nextProvider i18n={i18next}>
      <div aria-label="Index root" className="flex flex-col min-h-screen">
        <div aria-label="Navbar container" className="h-[15vh]">
          <Navbar toggleLoginPopup={toggleLoginPopup} setSelectedPage={setSelectedPage} />
        </div>

        <div aria-label="Main content container" className="flex-grow">
          {currentPage[selectedPage] ? (
            React.createElement(currentPage[selectedPage])
          ) : (
            <Home setSelectedPage={setSelectedPage} />
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
