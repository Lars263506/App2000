import { useState } from 'react'

import ClubList from '@/components/global/ClubList'
import ClubMap from '@/components/clubpage/ClubMap'

import Club from '@/types/club'

interface ClubLandingPageProps {
  setSelectedPage: (page: string) => void
}

const ClubLandingPage: React.FC<ClubLandingPageProps> = ({ setSelectedPage }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='flex flex-row justify-center items-center m-4'>
      <div className='flex flex-row flex-wrap h-full gap-4'>
        <div className="rounded-md bg-[#E7EFFB]">
          <ClubList
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedPage={setSelectedPage}
          />
        </div>
        <div className="min-w-[350px] rounded-md bg-[#E7EFFB]">
          <ClubMap selectedClub={selectedClub} setSelectedPage={setSelectedPage} />
        </div>
      </div>
    </div>
  )
}

export default ClubLandingPage
