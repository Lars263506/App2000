import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import Member from '../../types/member'
import { Club } from '../../types/club'
import { useTranslation } from 'react-i18next'

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This component displays a list of members for a club.
 * It fetches the member data from an API and displays it in a list format.
 */

interface MemberListProps {
  clubData: Club | null
}

const MemberList: React.FC<MemberListProps> = () => {
  const { t } = useTranslation()
  const [members, setMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/members'

      try {
        setLoading(true)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })

        if (response.status === 200) {
          const data = await response.json()

          if (Array.isArray(data) && data.length > 0) {
            setMembers(data)
          }
        }
      } catch (error) {
        console.error("Error fetching members:", error)
        toast.error(t("error_fetch_members"))
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <div className='p-4 border rounded-lg shadow-md bg-white w-full'>
      <h2 className='text-xl font-bold mb-2 text-black'>{t("memberlist_title")}</h2>
      {loading
        ? (
          <p className='text-gray-500'>{t("memberlist_loading")}</p>
          )
        : members.length > 0
          ? (
            <ul className='list-disc pl-4 text-black'>
              {members.map((member, index) => (
                <li key={member || index.toString()}>
                  {member || t("memberlist_unknown")}
                </li>
              ))}
            </ul>
            )
          : (
            <p className='text-gray-500'>{t("memberlist_nomembers")}</p>
            )}
    </div>
  )
}

export default MemberList