import React, { useState, useEffect } from 'react'

import { Club } from '../../types/club'

import { useTranslation } from 'react-i18next'

interface ClubListProps {
  selectedClub: Club | null
  setSelectedClub: (club: Club | null) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
}

const ClubList: React.FC<ClubListProps> = ({ selectedClub, setSelectedClub, searchTerm, setSearchTerm }) => {
  const { t } = useTranslation()
  const [clubs, setClubs] = useState<Club[]>([])

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
            placeholder={t("clublist_search")}
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
