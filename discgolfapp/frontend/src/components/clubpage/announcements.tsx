import React, { useEffect, useState } from 'react'

/**
 * @author Andreas Nilsen
 * @description Line: 38-41, ChatGPT has helped with styling in tailwind.
 */

interface AnnouncementProps {
  uniqueId: number
  text: string
  editRights: boolean
}

const Announcement: React.FC<AnnouncementProps> = ({ uniqueId, text, editRights }) => {
  const [content, setContent] = useState<string>('')

  const accessToken = localStorage.getItem('accessToken')
  const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/text/' + uniqueId

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

  useEffect(() => {
    setContent(text)
  }, [text])

  return (
    <div className='p-4 border rounded-lg shadow-md bg-white w-full'>
      <h2 className='text-xl font-bold mb-2 text-black'>Kunngjøringer</h2>

      {editRights
        ? (
          <textarea
            className='p-2 border rounded-md text-black min-w-[300px]'
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

export default Announcement
