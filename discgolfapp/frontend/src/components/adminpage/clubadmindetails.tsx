import { useState } from 'react'

import { Club } from '../../types/club'
import ClubList from '../global/clublist'
import ClubDetails from '../global/clubdetails'
import ClubSettings from '../global/clubsettings'

const ClubAdminDetails = () => {

	const [selectedClub, setSelectedClub] = useState<Club | null>(null)

	return (
		<div className='flex flex-row h-full gap-4'>
      		<ClubList setSelectedClub={setSelectedClub} />
			<ClubDetails selectedClub={selectedClub} />
			<ClubSettings selectedClub={selectedClub}/>
    	</div>
  	)
}

export default ClubAdminDetails
