import { useState } from 'react'

import MemberBenefit from '@/components/clubpage/MemberBenefit'
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
      <div className='flex flex-row h-full gap-4'>
        <div className="max-w-[300px] rounded-md bg-[#E7EFFB] p-2">
          <MemberBenefit />
        </div>
        <div className="rounded-md bg-[#E7EFFB]">
          <ClubList
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedPage={setSelectedPage}
          />
        </div>
        <div className="min-w-[700px] rounded-md bg-[#E7EFFB]">
          <ClubMap selectedClub={selectedClub} setSelectedPage={setSelectedPage} />
        </div>
      </div>
    </div>
  )
}

export default ClubLandingPage
