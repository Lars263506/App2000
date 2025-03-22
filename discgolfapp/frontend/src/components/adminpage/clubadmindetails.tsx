import { useState } from 'react'

import { Club } from '../../types/club'
import ClubList from '../global/clublist'
import ClubSettings from '../global/clubsettings'

const ClubAdminDetails = () => {

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedClub, setSelectedClub] = useState<Club | null>(null)

	return (
		<div className='flex flex-row h-full gap-4'>
			<div className="w-5/10 bg-white">
				<ClubList 
					selectedClub={selectedClub} 
					setSelectedClub={setSelectedClub} 
					searchTerm={searchTerm} 
					setSearchTerm={setSearchTerm}/>
			</div>

			{selectedClub && (
				<div className="bg-white w-5/10 overflow-y-auto">
					<ClubSettings selectedClub={selectedClub} setSelectedClub={setSelectedClub}/>
				</div>
			)}
    	</div>
  	)
}

export default ClubAdminDetails
