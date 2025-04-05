import React, { useEffect, useState } from 'react'

/**
 * @author Lars Andreas Strand
 * @description This component is used to display and edit announcements for a club.
 */

const Announcements = () => {
  const [content, setContent] = useState<string>('')
  const [editRights, setEditRights] = useState<boolean>(false)

  const accessToken = localStorage.getItem('accessToken')
  const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/announcements'

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })

        if (response.status === 200) {
          const data = await response.json()
          setContent(data.text)
        } else {
          console.error('Error fetching announcements:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    }

    fetchAnnouncements()
  }, [url, accessToken])


  const handleBlur = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: e.target.value
      })
    })
  }

  const checkEditRights = async () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/permissions/'
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        setEditRights(data.editRights)
      } else {
        setEditRights(false)
      }
    } catch (error) {
      console.error('Error fetching edit rights:', error)
    }
  }

  return (
    <div className='p-4 border rounded-lg shadow-md bg-white w-full h-full'>
      <h2 className='text-xl font-bold mb-2 text-black'>Kunngjøringer</h2>

      {editRights
        ? (
          <textarea
            className='p-2 border rounded-md text-black w-full min-h-[100px]'
            placeholder='Skriv her...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={async (e) => await handleBlur(e)}
          />
          )
        : (
          <p className='p-2 border rounded-md text-black min-w-[300px]'>
            {content}
          </p>
          )}

    </div>
  )
}

export default Announcements
