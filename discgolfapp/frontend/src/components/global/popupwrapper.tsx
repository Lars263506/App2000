import Login from '@/components/global/login'
import Register from '@/components/global/register'
import MyPagePopup from '@/pages/mypage'

interface PopupWrapperProps {
  popupType: 'login' | 'register' | 'mypage' | null
  closePopup: () => void
  toggleRegisterPopup: () => void
  toggleMyPagePopup: () => void
}

const PopupWrapper = ({ popupType, closePopup, toggleRegisterPopup, toggleMyPagePopup }: PopupWrapperProps) => {
  return (
    <>
      {popupType === 'login' && (
        <Login
          togglePopup={closePopup}
          toggleRegisterPopup={toggleRegisterPopup}
          closePopup={closePopup}
          toggleMyPagePopup={toggleMyPagePopup}
        />
      )}
      {popupType === 'register' && (
        <Register
          togglePopup={toggleRegisterPopup}
          closePopup={closePopup}
        />
      )}
      {popupType === 'mypage' && 
      (<MyPagePopup/>)}
    </>
  )
}

export default PopupWrapper
