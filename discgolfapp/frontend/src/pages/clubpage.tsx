import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import '../app/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/global/navbar'
import Toolbox from '../components/clubpage/toolbox'
import PopupWrapper from '@/components/global/popupwrapper'
import { usePopup } from '@/components/global/usepopup'

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This is the main page for the clubpage. It contains the navbar and the toolbox.
 */

const Clubpage = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup()
  const router = useRouter()
  const clubId = router.query.clubId as string | undefined

  const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID

  return (
    <div className=''>
      <Navbar toggleLoginPopup={toggleLoginPopup} />

      <Toolbox clubId={id} />

      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />
    </div>
  )
}

export default Clubpage
