import Login from '@/components/global/login'
import Register from '@/components/global/register'

interface PopupWrapperProps {
  popupType: 'login' | 'register' | 'mypage' | null
  closePopup: () => void
  toggleRegisterPopup: () => void
  setSelectedPage: (page: string) => void
}

const PopupWrapper: React.FC<PopupWrapperProps> = ({ popupType, toggleRegisterPopup, closePopup, setSelectedPage}) => {
  return (
    <>
      {popupType === 'login' && (
        <Login
          togglePopup={closePopup}
          toggleRegisterPopup={toggleRegisterPopup}
          closePopup={closePopup}
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
