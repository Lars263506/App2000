import Login from '@/components/global/Login'
import Register from '@/components/global/Register'

interface PopupWrapperProps {
  popupType: 'login' | 'register' | 'mypage' | null
  closePopup: () => void
  toggleRegisterPopup: () => void
  selectedPage: string
  setSelectedPage: (page: string) => void
}

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
