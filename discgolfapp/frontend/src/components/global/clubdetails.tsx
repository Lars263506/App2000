import React, { useState, useEffect } from 'react'
import { Club } from '../../types/club'

interface ClubDetailsProps {
  selectedClub: Club | null;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ selectedClub }) => {
  
  return (
    <div className='flex min-h-[580px] flex-col md:flex-row gap-6 w-full h-100 max-w-5xl '>
      {selectedClub ? (
        <div className='w-full md:w-1/2 bg-gray-200 p-4 rounded-xl shadow text-black'>
            <h2 className='text-xl font-bold'>{selectedClub.name}</h2>
            <p>{selectedClub.address}</p>
        </div>) : (
        <div className='w-full md:w-1/2 bg-gray-200 p-4 rounded-xl shadow text-black'>
            <h2 className='text-xl font-bold'>Velg en klubb</h2>
        </div>)}
    </div>
  )
}
export default ClubDetails
