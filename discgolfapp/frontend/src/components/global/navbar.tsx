import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import UseTranslation from '../global/utils/usetranslation';

interface NavBarProps {
  toggleLoginPopup: () => void;
  setSelectedPage: (page: string) => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleLoginPopup, setSelectedPage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('no');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  return (
    <nav className='bg-[#1B365D] text-white py-4 px-6 flex justify-center'>
      {/* Wrapper for å sentrere innholdet */}
      <div className='w-full max-w-6xl flex items-center justify-between'>
        {/* Logo + Tittel (Sentrert i sin del av navbaren) */}
        <div
          className='flex items-center space-x-3 cursor-pointer'
          onClick={async () => setSelectedPage('Home')}
        >
          <Image
            src='/images/logo01.png'
            alt='Logo'
            width={50}
            height={50}
          />
          <h1 className='text-xl font-bold leading-tight'>
            <span className='block'><UseTranslation variable="navbar_norway" /></span>
            <span className='block'><UseTranslation variable="navbar_discgolf_association" /></span>
          </h1>
        </div>

        {/* Søkeboks (Sentrert i navbaren) */}
        <div className='flex-grow flex justify-center'>
          <input
            type='text'
            placeholder='Søk...'
            className='w-full max-w-md px-4 py-2 rounded bg-gray-200 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
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
            alt={selectedLanguage === 'no' ? 'Språk: Norsk' : 'Language: English'}
            width={26}
            height={26}
            className='cursor-pointer invert'
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
    </nav>
  );
};

export default Navbar;