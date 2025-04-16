import { useState } from 'react'

import MemberBenefit from '@/components/clubpage/memberbenefit'
import ClubList from '@/components/global/clublist'
import ClubMap from '@/components/clubpage/clubmap'

import { Club } from '@/types/club'

interface ClubLandingPageProps {
  setSelectedPage: (page: string) => void
}

const ClubLandingPage: React.FC<ClubLandingPageProps> = ({ setSelectedPage }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='flex flex-row justify-center items-center mt-24'>
      <div className='flex flex-row h-full gap-4'>
        <div className="w-2/10 rounded-md bg-[#E7EFFB]">
          <MemberBenefit />
        </div>
        <div className="w-2/10 rounded-md bg-[#E7EFFB]">
          <ClubList
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedPage={setSelectedPage}
          />
        </div>
        <div className="w-1/2 rounded-md bg-[#E7EFFB]">
          <ClubMap selectedClub={selectedClub} setSelectedPage={setSelectedPage} />
        </div>
      </div>
    </div>
  )
}

export default ClubLandingPage
