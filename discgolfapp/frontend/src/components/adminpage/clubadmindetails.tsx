import { useState } from 'react'

import { Club } from '../../types/club'
import ClubList from '../global/clublist'
import ClubDetails from '../global/clubdetails'

const ClubAdminDetails = () => {

	const [selectedClub, setSelectedClub] = useState<Club | null>(null)

	return (
		<div className=''>
      		<ClubList setSelectedClub={setSelectedClub} />
			<ClubDetails selectedClub={selectedClub} />
    	</div>
  	)
}

export default ClubAdminDetails
