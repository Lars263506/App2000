import React, { useState, useEffect } from 'react'

import { Club } from '../../types/club'

interface ClubListProps {
  selectedClub: Club | null
  setSelectedClub: (club: Club) => void
}

const ClubList: React.FC<ClubListProps> = ({ selectedClub, setSelectedClub }) => {
  const [clubs, setClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchClubs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`)
      const data = await response.json()
      if (Array.isArray(data.data)) setClubs(data.data)
    } catch (error) {
      console.error('Feil ved henting av klubber:', error)
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [selectedClub])

  return (
    <div className='flex p-4 text-black'>
      <div className='flex-grow'>
        <div className="flex flex-row gap-2">
          <input
            type='text'
            placeholder='Filtrer på klubbnavn...'
            className='border p-2 rounded w-fit'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchClubs}>
            &#x21bb; {/* refresh icon */}
          </button>
        </div>

        <ul>
          {clubs
            .filter((club) => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((club) => (
              <li key={club._id} className='p-1 border-b last:border-none'>
                <button onClick={() => setSelectedClub(club)} className='text-blue-600 hover:text-blue-800'>
                  {club.name}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
export default ClubList
