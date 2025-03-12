import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

interface Club {
  _id: string
  name: string
  address: string
}

const ClubList = () => {
  const [clubs, setClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`)
        const data = await response.json()
        if (Array.isArray(data.data)) setClubs(data.data)
      } catch (error) {
        console.error('Feil ved henting av klubber:', error)
      }
    }
    fetchClubs()
  }, [])
  
  return (
    <div className='flex min-h-[580px] flex-col md:flex-row gap-6 w-full h-100 max-w-5xl '>
      <div className='w-full md:w-1/2 bg-gray-200 p-4 rounded-xl shadow text-black'>
        <input
          type='text'
          placeholder='Filtrer på klubbnavn...'
          className='border p-2 rounded w-full mb-4'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {clubs
            .filter((club) => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((club) => (
              <li key={club._id} className='p-1 border-b last:border-none'>
                <Link href={`/clubpage?clubId=${club._id}`} className='text-blue-600 hover:text-blue-800'>
                  {club.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
export default ClubList
