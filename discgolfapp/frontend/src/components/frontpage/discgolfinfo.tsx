import React from 'react'
import Image from 'next/image'
import Button from '../global/button'

interface DiscgolfInfoProps {
  images: string[]
  currentImageIndex: number
}

const DiscgolfInfo: React.FC<DiscgolfInfoProps> = ({ images, currentImageIndex }) => {
  return (
    <div className='max-w-6xl mx-auto py-4 flex flex-wrap justify-center items-center gap-6'>

      {/* Bildekort */}
      <div className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[40%] h-[280px] flex items-center justify-center'>
        <Image 
          src={images[currentImageIndex]} 
          alt='Placeholder' 
          width={250} 
          height={250} 
          className='object-cover rounded'
        />
      </div>

      {/* Informasjon om Discgolf */}
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

        {/* "Spill nå"-knappen */}
        <div className="text-center">
          <Button>Spill nå</Button>
        </div>
      </div>

    </div>
  )
}

export default DiscgolfInfo
