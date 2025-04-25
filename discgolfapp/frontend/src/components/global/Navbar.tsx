/**
 * Navbar Component
 * This file has been translated using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import "../../i18n"
import { useTranslation } from 'react-i18next';

import LanguageModal from './utils/LanguageModal';
import WithAdminAccess from '../adminpage/WithAdminAccess';
import WithPageEditAccess from '../adminpage/WithEditPageAccess';

/**
 * @author Adrian Johansen
 * @description This component renders the navigation bar for the application.
 * It includes links to the home page, profile, language selection, and admin pages.
 * The navbar supports language switching, test data reset, and displays a logo with the app's name.
 * Translations are used for all tooltips and text, and success/error notifications are shown for actions.
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 */

interface NavBarProps {
  toggleLoginPopup: () => void;
  setSelectedPage: (page: string) => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleLoginPopup, setSelectedPage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('no');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    setIsModalOpen(false);
  };

  const handleResetTestData = async () => {
    try {
      const confirmation = prompt(t('navbar_testdata_reset_confirm'));
      if (confirmation !== 'OK') {
        toast.info(t('navbar_testdata_reset_cancelled'));
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error(t('navbar_testdata_no_access_token'));
        return;
      }
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/reset/testdata';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(t('navbar_testdata_reset_failed', { statusText: response.statusText }));
      }

      toast.success(t('navbar_testdata_reset_success'));
      setSelectedPage('Home');
      window.location.reload();
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
      else
        toast.error(t('navbar_testdata_reset_error'));
    }
  }

  return (
    <nav aria-label="Navbar root" className='bg-[#1B365D] py-4 justify-center w-[100%]'>
      <div className='w-full flex flex-wrap items-center justify-center gap-4'>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={async () => setSelectedPage('Home')}
        >
          <Image
            src='/images/logo01.png'
            alt='Logo'
            width={50}
            height={50}
          />
          <h1 className='text-xl text-white font-bold leading-tight'>
            <span className='block'>{t("navbar_logotext_norways")}</span>
            <span className='block'>{t("navbar_logotext_association")}</span>
          </h1>
        </div>

        <div className='flex space-x-6'>
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src='/images/home-regular-24.png'
              alt='Hjem'
              title={t('navbar_home')}
              width={26}
              height={26}
              priority
              className='cursor-pointer invert'
              onClick={() => setSelectedPage('Home')}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src='/images/user-circle-regular-24.png'
              alt='Profil'
              title={t('navbar_profile')}
              width={26}
              height={26}
              priority
              className='cursor-pointer invert'
              onClick={toggleLoginPopup}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src='/images/world-regular-24.png'
              alt='Språk'
              title={t('navbar_language')}
              width={26}
              height={26}
              priority
              className='cursor-pointer invert'
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <WithPageEditAccess>
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src='/images/adminsettings.png'
                alt='AdminPage'
                title={t('navbar_admin')}
                width={26}
                height={26}
                priority
                className='cursor-pointer invert'
                onClick={() => setSelectedPage('Admin')}
              />
            </div>
          </WithPageEditAccess>
          <WithAdminAccess>
          <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src='/images/bx-reset.png'
                alt='ResetTestData'
                title={t('navbar_reset_testdata')}
                width={26}
                height={26}
                priority
                className='cursor-pointer invert'
                onClick={handleResetTestData}
              />
            </div>
          </WithAdminAccess>
        </div>
      </div>

      {isModalOpen && (
        <LanguageModal
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageChange}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
