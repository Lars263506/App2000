import { useState } from 'react'

import ClubList from '@/components/global/ClubList'
import ClubMap from '@/components/clubpage/ClubMap'

import Club from '@/types/club'

/**
 * @author Adrian Johansen
 * @description This component serves as the landing page for clubs.
 * It displays a list of clubs and a map with club locations.
 * Users can search for clubs, select a club from the list, or interact with the map to view club details.
 * The page dynamically updates based on the selected club and search term.
 */
/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

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
