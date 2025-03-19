import { useState } from 'react'

import MemberBenefit from '@/components/clubpage/memberbenefit'
import ClubList from '@/components/global/clublist'
import ClubMap from '@/components/clubpage/clubmap'

import { Club } from '@/types/club'

const ClublandingPage = () => {

  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex flex-col sm:flex-row items-start gap-4 px-4 py-4'>
        <MemberBenefit />
        <ClubList selectedClub={selectedClub} setSelectedClub={setSelectedClub} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <ClubMap searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default ClublandingPage
