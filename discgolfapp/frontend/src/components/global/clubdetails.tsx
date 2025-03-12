import React from 'react'
import { Club } from '../../types/club'

interface ClubDetailsProps {
  selectedClub: Club | null;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ selectedClub }) => {
  
  return (
    <div className='flex w-auto'>
      {selectedClub ? (
        <div className='bg-gray-200 p-4 rounded-xl shadow text-black'>
            <h2 className='text-xl font-bold'>{selectedClub.name}</h2>
            <p>{selectedClub.address}</p>
        </div>) : (
        <div className='bg-gray-200 p-4 rounded-xl shadow text-black'>
            <h2 className='text-xl font-bold'>Velg en klubb</h2>
        </div>)}
    </div>
  )
}
export default ClubDetails
