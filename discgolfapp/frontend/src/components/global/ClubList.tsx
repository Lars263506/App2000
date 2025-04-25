import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import Club from '../../types/club'
import { useTranslation } from 'react-i18next'

/**
 * ClubList Component
 * Provides a list of clubs with search and selection functionality.
 * Includes translated text using i18next for localization support.
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 * @author Lars Andreas Strand and Andreas Nilsen
 */

interface ClubListProps {
  selectedClub: Club | null
  setSelectedClub: (club: Club | null) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  setSelectedPage: (page: string) => void
}

/**
 * Fetches the list of clubs from the backend and updates the state.
 * Displays an error toast if the fetch operation fails.
 * 
 * @function fetchClubs
 * @returns {Promise<void>}
 * @author Lars Andreas Strand and Andreas Nilsen
 */

const ClubList: React.FC<ClubListProps> = ({ selectedClub, setSelectedClub, searchTerm, setSearchTerm, setSelectedPage }) => {
  const { t } = useTranslation()
  const [clubs, setClubs] = useState<Club[]>([])

  const fetchClubs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`)
      const data = await response.json()
      if (Array.isArray(data.data)) setClubs(data.data)
    } catch (error) {
      toast.error('Feil ved henting av klubber: ' + error)
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [selectedClub])

  /**
   * Renders the ClubList component, including search functionality and club selection.
   * 
   * @function ClubList
   * @param {ClubListProps} props - Contains selected club, search term, and handlers for state updates.
   * @returns {JSX.Element}
   * @author Lars Andreas Strand and Andreas Nilsen
   */

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
              <li key={club._id} className="mb-2">
                <button
                  className={`block w-full text-left px-4 py-2 rounded-lg shadow transition ${selectedClub?.name === club.name ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-100 text-black'}`}
                  onClick={() => {
                    localStorage.setItem("selectedClub", JSON.stringify(club));
                    setSelectedClub(club);
                    if(localStorage.getItem("selectedPage") === "ClubLanding")
                      setSelectedPage('Club');
                  }}
                >
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
