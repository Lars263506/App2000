import React from 'react'
import Image from 'next/image'

export default function Footer () {
  return (
    <footer className='bg-gray-600 text-center p-4 border-t border-gray-300'>
      <div className='flex justify-between items-center max-w-7xl mx-auto h-1'>
        <a href='/kontakt' className='text-white hover:underline '>
          Kontakt oss
        </a>
        <div className='flex space-x-4'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-facebook-circle.svg' alt='Facebook' width={24} height={24} className='w-6 h-6' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-instagram-alt.svg' alt='Instagram' width={24} height={24} className='w-6 h-6' />
          </a>
          <a href='https://snapchat.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-snapchat.svg' alt='Snapchat' width={24} height={24} className='w-6 h-6' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <Image src='/bxl-twitter.svg' alt='Twitter' width={24} height={24} className='w-6 h-6' />
          </a>
        </div>
        <a href='/personvern' className='text-white hover:underline'>
          Personvern
        </a>
      </div>
    </footer>
  )
}
