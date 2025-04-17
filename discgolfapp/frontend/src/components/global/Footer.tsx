'use client'

import React from 'react'
import Image from 'next/image'

import { useTranslation } from 'react-i18next'

interface FooterProps {
  setSelectedPage: (page: string) => void
}

const Footer: React.FC<FooterProps> = ({ setSelectedPage }) => {
  const { t } = useTranslation()

  return (
    <footer className='text-center py-2 bg-[#1B365D] text-white'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-center gap-36 items-center'>

        {/* Kontakt oss-knapp */}
        <button
          onClick={() => setSelectedPage('Contact')}
          className='hover:text-[#5A8FCC] transition-colors duration-300'
        >
          {t("footer_contactus")}
        </button>

        {/* Sosiale medier */}
        <div className='flex space-x-6 my-4 sm:my-0'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/svg/bxl-facebook-circle.svg' alt='Facebook' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/svg/bxl-instagram-alt.svg' alt='Instagram' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://snapchat.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/svg/bxl-snapchat.svg' alt='Snapchat' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/svg/bxl-twitter.svg' alt='Twitter' width={24} height={24} className='w-6 h-6 invert' />
          </a>
        </div>

        {/* Personvern */}
        <button
          onClick={() => setSelectedPage('Privacy')}
          className='hover:text-[#5A8FCC] transition-colors duration-300'
        >
          {t("footer_privacy")}
        </button>

      </div>
    </footer>
  )
}

export default Footer
