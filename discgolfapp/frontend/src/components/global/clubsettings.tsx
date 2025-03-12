import React from 'react'
import { Club } from '../../types/club'

interface ClubDetailsProps {
  selectedClub: Club | null;
}

const ClubSettings: React.FC<ClubDetailsProps> = ({ selectedClub }) => {
  
    const changeName = () => {
        console.log('Endre navn')
    }

    return (
        <div className='flex min-w-[300px] w-auto bg-gray-200 p-4 rounded-xl shadow text-black'>
            {selectedClub ? (
                <div className='flex flex-col text-black'>
                    Klubbnavn
                    <input onSubmit={changeName} value={selectedClub.name} />
                </div>
                ) : null}
        </div>
    )
}
export default ClubSettings
