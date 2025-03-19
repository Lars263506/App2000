import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Home from '@/components/pages/Home';
import AdminPage from '@/components/pages/AdminPage';
import PlayPage from '@/components/pages/PlayPage';
import GetStartedPage from '@/components/pages/GetStartedPage';
import CourseLandingPage from '@/components/pages/ClubLandingPage';
import CoursePage from '@/components/pages/CoursePage';

import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';
import PopupWrapper from '@/components/global/popupwrapper';
import { usePopup } from '@/components/global/usepopup';

/**
 * @author Lars Andreas Strand, Andreas Nilsen and Adrian Johansen
 * @description The main page of the website.
 * This page contains the navbar, main content and footer.
 * The main content is determined by the selected page.
 * The selected page is changed by the navbar or navigation components.
 * The page also contains a popup for login, register and my page.
 * All toasts are displayed in the toast container on this page.
 */

const Index = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, toggleMyPagePopup, closePopup } = usePopup();
  const [selectedPage, setSelectedPage] = React.useState('Home');

  const currentPage: { [key: string]: React.FC } = {
    'Home': () => <Home setSelectedPage={setSelectedPage} />,
    'Admin': () => <AdminPage />,
    'Play': () => <PlayPage />,
    'GetStarted': () => <GetStartedPage />,
    'Courses': () => <CourseLandingPage />,
    'Clubs': () => <CoursePage />,
    'Contact': () => <div>Contact</div>,
    'Privacy': () => <div>Privacy</div>,
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
    <div aria-label="Index root">
      <div aria-label="Navbar container" className="h-[15vh]">
        <Navbar toggleLoginPopup={toggleLoginPopup} setSelectedPage={setSelectedPage}/>
      </div>

      <div aria-label="Main content container" className="flex-grow">
        {currentPage[selectedPage] ? (
          React.createElement(currentPage[selectedPage])
        ) : (
          <Home setSelectedPage={setSelectedPage}/>
        )}
      </div>

      <div aria-label="Footer container" className="h-[10vh]">
        <Footer />
      </div>

      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
        toggleMyPagePopup={toggleMyPagePopup}
      />

      <ToastContainer />
    </div>
  );
};

export default Index;
