import { useState } from 'react'

/**
 * usePopup Hook
 * Manages the state and behavior of popups (login, register, mypage) in the application.
 * 
 * @author Andreas Nilsen
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 */

type PopupType = 'login' | 'register' | 'mypage'| null

/**
 * Type definition for PopupType
 * Represents the type of popup that can be displayed.
 * 
 * @typedef {'login' | 'register' | 'mypage' | null} PopupType
 * @author Andreas Nilsen
 */

export const usePopup = () => {
  const [popupType, setPopupType] = useState<PopupType>(null)

  /**
   * Toggles the login popup state.
   * If the login popup is open, it will close; otherwise, it will open.
   * 
   * @function toggleLoginPopup
   * @returns {void}
   * @author Andreas Nilsen
   */
  const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login')

  /**
   * Toggles the register popup state.
   * If the register popup is open, it will switch to the login popup; otherwise, it will open the register popup.
   * 
   * @function toggleRegisterPopup
   * @returns {void}
   * @author Andreas Nilsen
   */
  const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register')

  /**
   * Closes any open popup.
   * 
   * @function closePopup
   * @returns {void}
   * @author Andreas Nilsen
   */
  const closePopup = () => setPopupType(null)

  return {
    popupType,
    toggleLoginPopup,
    toggleRegisterPopup,
    closePopup
  }
}
