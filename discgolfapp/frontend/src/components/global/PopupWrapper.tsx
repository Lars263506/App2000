/**
 * PopupWrapper Component
 * Dynamically renders different popup components (Login, Register) based on the provided popup type.
 * 
 * @author Andreas Nilsen
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 */

import Login from '@/components/global/Login'
import Register from '@/components/global/Register'

interface PopupWrapperProps {
  popupType: 'login' | 'register' | 'mypage' | null
  closePopup: () => void
  toggleRegisterPopup: () => void
  selectedPage: string
  setSelectedPage: (page: string) => void
}

/**
 * PopupWrapper functional component
 * Renders the appropriate popup component based on the popupType prop.
 * 
 * @function PopupWrapper
 * @param {PopupWrapperProps} props - The props for the component.
 * @returns {JSX.Element} The rendered popup component.
 * @author Andreas Nilsen
 */
const PopupWrapper: React.FC<PopupWrapperProps> = ({ popupType, toggleRegisterPopup, closePopup, selectedPage, setSelectedPage}) => {
  return (
    <>
      {popupType === 'login' && (
        <Login
          togglePopup={closePopup}
          toggleRegisterPopup={toggleRegisterPopup}
          closePopup={closePopup}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}
      {popupType === 'register' && (
        <Register
          togglePopup={toggleRegisterPopup}
          closePopup={closePopup}
        />
      )}
    </>
  )
}

export default PopupWrapper
