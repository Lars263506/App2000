import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import "../../i18n"
import { useTranslation } from 'react-i18next';

import LanguageModal from '../global/utils/LanguageModal';
import WithAdminAccess from '../adminpage/withadminaccess';
import WithPageEditAccess from '../adminpage/withpageeditaccess';

interface NavBarProps {
  toggleLoginPopup: () => void;
  setSelectedPage: (page: string) => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleLoginPopup, setSelectedPage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('no');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["no", "en"]);
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
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/reset/testdata/';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      toast.success(t('navbar_testdata_reset_success'));
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
      else
        toast.error(t('navbar_testdata_reset_error'));
    }
  }

  return (
    <nav aria-label="Navbar root" className='bg-[#1B365D] text-white py-4 px-6 flex justify-center'>
      <div className='w-full max-w-5xl flex items-center justify-between'>
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
          <h1 className='text-xl font-bold leading-tight'>
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
          </WithPageEditAccess>
        </div>
      </div>

      {isModalOpen && (
        <LanguageModal
          availableLanguages={availableLanguages}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageChange}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
