import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from '../global/button'

const DiscgolfInfo = () => {

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
    <div className='max-w-6xl mx-auto py-4 flex flex-wrap justify-center items-center gap-6'>

      <div className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[40%] flex items-center justify-center'>
        <Image
          src={images[currentImageIndex]}
          alt='Placeholder'
          width={250}
          height={250}
          className='object-cover rounded'
        />
      </div>

      <div className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[50%] h-[280px] flex flex-col justify-between'>
        <div>
          <h2 className='text-[#1B365D] text-2xl font-bold text-center'>Om Discgolf</h2>
          <p className='mt-2 text-[#2A4470] text-sm text-center'>
            Discgolf er en morsom og utfordrende sport som ligner på vanlig golf,
            men i stedet for å bruke en ball og kølle, bruker du en disc (frisbee).
            Målet er å kaste discen fra startpunktet til kurven på færrest mulig kast.
          </p>
          <p className='mt-2 text-[#2A4470] text-sm text-center'>
            Discgolfbaner varierer i lengde og vanskelighetsgrad. Noen baner har
            hindringer som trær, busker og vann som gjør spillet mer utfordrende.
            Prøv å følge etikette på banen for en god opplevelse.
          </p>
        </div>

        <div className="text-center">
          <Button>Spill nå</Button>
        </div>
      </div>

    </div>
  )
}

export default DiscgolfInfo
