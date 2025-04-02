import { useState } from 'react'

import MemberBenefit from '@/components/clubpage/memberbenefit'
import ClubList from '@/components/global/clublist'
import ClubMap from '@/components/clubpage/clubmap'

import { Club } from '@/types/club'

const ClublandingPage = () => {

  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='flex flex-row justify-center items-center'>
      <div className='flex flex-row h-full gap-4'>
        <div className="w-2/10 rounded-md bg-[#E7EFFB] border border-solid border-black shadow">
          <MemberBenefit />
        </div>
        <div className="w-3/10 rounded-md bg-[#E7EFFB] border border-solid border-black shadow">
          <ClubList selectedClub={selectedClub} setSelectedClub={setSelectedClub} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>
        <div className="w-1/2 rounded-md bg-[#E7EFFB] border border-solid border-black shadow">
          <ClubMap searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  )
}

export default ClublandingPage
