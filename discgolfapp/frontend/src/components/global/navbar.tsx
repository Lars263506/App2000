import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import UseTranslation from '../global/utils/usetranslation';
import LanguageModal from '../global/utils/LanguageModal';

interface NavBarProps {
  toggleLoginPopup: () => void;
  setSelectedPage: (page: string) => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleLoginPopup, setSelectedPage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('no');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const availableLanguages = ['no', 'en', 'es', 'fr']; // Add your available language codes here

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    setIsModalOpen(false);
    window.location.reload();
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
            <span className='block'><UseTranslation variable="navbar_logotext_norways" /></span>
            <span className='block'><UseTranslation variable="navbar_logotext_association" /></span>
          </h1>
        </div>

        {/* Ikoner (Jevnt fordelt, sentrert i sin del) */}
        <div className='flex space-x-6'>
          <Image
            src='/images/home-regular-24.png'
            alt='Hjem'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={() => setSelectedPage('Home')}
          />
          <Image
            src='/images/user-circle-regular-24.png'
            alt='Profil'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={toggleLoginPopup}
          />
          <Image
            src='/images/world-regular-24.png'
            alt='Språk'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={() => setIsModalOpen(true)}
          />
          <Image
            src='/images/adminsettings.png'
            alt='AdminPage'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={() => setSelectedPage('Admin')}
          />
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