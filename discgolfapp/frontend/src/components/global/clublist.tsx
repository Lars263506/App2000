import React, { useState, useEffect } from 'react'

import { Club } from '../../types/club'
import WithAdminAccess from '../adminpage/withadminaccess'
import { toast } from 'react-toastify'

interface ClubListProps {
  selectedClub: Club | null
  setSelectedClub: (club: Club | null) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
}

const ClubList: React.FC<ClubListProps> = ({ selectedClub, setSelectedClub, searchTerm, setSearchTerm }) => {
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

  const handleCreateClub = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: 'Ny klubb',
          clubOwner: '',
          description: 'Beskrivelse av ny klubb',
          nonmemberElements: [],
          memberElements: [],
          address: 'Sted for ny klubb',
          zipCode: '1234',
          websiteURL: 'plassholder.no',
          email: 'email@plassholder.no',
          phone: '12345678',
          members: [],
          events: []
        })
      })
      const data = await response.json()
      if (data.status === 201) {
        toast.success('Klubben ble opprettet under navnet "Ny klubb". Husk å bytte navn og fylle inn informasjon.')
        fetchClubs()
      }
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message)
      else toast.error('Det skjedde en feil ved oppretting av klubb. Prøv igjen senere')
    }
  }

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

        <WithAdminAccess setSelectedPage={() => {}}>
          <button 
            className='p-2 mt-2 bg-blue-600 text-white rounded' 
            onClick={() => handleCreateClub()}
          >
            Legg til ny klubb
          </button>
        </WithAdminAccess>
      </div>
    </div>
  )
}
export default ClubList
