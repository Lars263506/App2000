import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

  return (
    <nav className='bg-[#1B365D] text-white py-4 px-6 flex justify-center'>
      {/* Wrapper for å sentrere innholdet */}
      <div className='w-full max-w-5xl flex items-center justify-between'>

        {/* Logo + Tittel (Sentrert i sin del av navbaren) */}
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

        {/* Ikoner (Jevnt fordelt, sentrert i sin del) */}
        <div className='flex space-x-6'>
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src='/images/home-regular-24.png'
              alt='Hjem'
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
                width={26}
                height={26}
                priority
                className='cursor-pointer invert'
                onClick={() => setSelectedPage('Admin')}
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
