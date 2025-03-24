import { useState } from 'react'

type PopupType = 'login' | 'register' | 'mypage'| null

export const usePopup = () => {
  const [popupType, setPopupType] = useState<PopupType>(null)

  const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login')
  const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register')
  const closePopup = () => setPopupType(null)

  return {
    popupType,
    toggleLoginPopup,
    toggleRegisterPopup,
    closePopup
  }
}
