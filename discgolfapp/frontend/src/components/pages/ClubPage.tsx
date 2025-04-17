
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

import Club from "@/types/aaa"

import ClubHeader from "@/components/clubpage/ClubHeader"
import ClubDetails from "@/components/clubpage/ClubDetails"


/**
 * @author Lars Andreas Strand
 * @description This page is used to display the club page for a specific club.
 * Upon mounting, it sets the selected club data from localStorage.
 * It displays the club header and details about the club.
 */

interface ClubpageProps {
  setSelectedPage: (page: string) => void
}

const Clubpage: React.FC<ClubpageProps> = ({ setSelectedPage }) => {
  const { t } = useTranslation()

  const [clubData, setClubData] = useState<Club | null>(null)

  useEffect(() => {
    const selectedClub = localStorage.getItem("selectedClub")

    if (selectedClub) {
      const parsedClub = JSON.parse(selectedClub)
      setClubData(parsedClub)
    } else {
      toast.error("No club data found in localStorage")
    }
  } , [])

  return (
    <div aria-label="Clubpage root" className="flex flex-row">
      <div className="flex flex-col relative w-full min-h-[80vh] mx-4">
        <ClubHeader clubData={clubData} />
        <ClubDetails clubData={clubData} setSelectedPage={setSelectedPage} />
      </div>
    </div>
  )
}

export default Clubpage
