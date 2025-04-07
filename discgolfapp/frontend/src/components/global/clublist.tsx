import React, { useState, useEffect } from 'react'

import { Club } from '../../types/club'

import { useTranslation } from 'react-i18next'

interface ClubListProps {
  selectedClub: Club | null
  setSelectedClub: (club: Club | null) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  setSelectedPage: (page: string) => void
}

const ClubList: React.FC<ClubListProps> = ({ selectedClub, setSelectedClub, searchTerm, setSearchTerm, setSelectedPage }) => {
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
        <div className="flex flex-row gap-2 mb-4">
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
              <li key={club._id} className='p-1 shadow shadow-black rounded-md mb-2'>
                <div className='flex justify-between items-center'>
                  <button onClick={() => setSelectedClub(club)} className='hover:text-blue-800'>
                    {club.name}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClub(club);
                      setSelectedPage('Club');
                    }}
                    className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700'>
                    {t('clublist_visit')}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
export default ClubList
