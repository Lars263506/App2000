import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import Button from '../global/Button'
import { useTranslation } from 'react-i18next'

interface DiscGolfInfoProps {
  setSelectedPage: (page: string) => void;
}

const DiscgolfInfo: React.FC<DiscGolfInfoProps> = ({ setSelectedPage }) => {

  const { t } = useTranslation()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    '/images/golf1.jpg',
    '/images/golf2.jpg',
    '/images/golf3.jpg',
    '/images/golf4.jpg',
    '/images/golf5.jpg'
  ]

  // Changes the image every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % images.length)
    }, 6000)

    return () => clearInterval(interval)
  }
  , [currentImageIndex])

  return (
    <div className='max-w-6xl mx-auto py-4 flex flex-wrap justify-center items-center gap-5'>

      <div className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[50%] min-h-[300px] flex flex-col justify-between'>
        <div>
          <h2 className='text-[#1B365D] text-2xl font-bold text-center'>{t("discgolfinfo_title")}</h2>
          <p className='mt-2 text-[#2A4470] text-sm text-center'>
            {t("discgolfinfo_intro")}
          </p>
          <p className='mt-2 text-[#2A4470] text-sm text-center'>
            {t("discgolfinfo_text")}
          </p>
        </div>

        <div className="text-center">
          <Button onClick={() => setSelectedPage("Play")}>{t("discgolfinfo_playnow")}</Button>
        </div>
      </div>

      <div className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[40%] flex items-center justify-center'>
        <Image
          src={images[currentImageIndex]}
          alt='Placeholder'
          width={250}
          height={250}
          className='object-cover rounded'
        />
      </div>

    </div>
  )
}

export default DiscgolfInfo
