
/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This is the main page for the clubpage.
 */

import { useEffect } from "react"

const Clubpage = () => {

  useEffect(() => {
    // Fetch club data from backend
    // Use localStorage to get id from "selectedClub"
    // Use the id to fetch the club data
  } , [])

  return (
    <div aria-label="Clubpage root" className="flex flex-row w-full h-full">
      {/* Toolbar */}
      Toolbar goes here
      {/* DropZone */}
      DropZone goes here
    </div>
  )
}

export default Clubpage
