import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Footer() {
  const router = useRouter()
  return (
    <footer className='bg-[#1B365D] text-white text-center py-6'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center'>
    
        {/* Kontakt oss-knapp */}
        <button
          onClick={() => router.push('/callus')}
          className='hover:text-[#5A8FCC] transition-colors duration-300'
        >
          Kontakt oss
        </button>

        {/* Sosiale medier */}
        <div className='flex space-x-6 my-4 sm:my-0'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-facebook-circle.svg' alt='Facebook' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-instagram-alt.svg' alt='Instagram' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://snapchat.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-snapchat.svg' alt='Snapchat' width={24} height={24} className='w-6 h-6 invert' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-twitter.svg' alt='Twitter' width={24} height={24} className='w-6 h-6 invert' />
          </a>
        </div>

        {/* Personvern */}
        <a href='/personvern' className='hover:text-[#5A8FCC] transition-colors duration-300'>
          Personvern
        </a>

      </div>
    </footer>
  )
}
