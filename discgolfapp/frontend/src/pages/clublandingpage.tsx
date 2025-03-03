import Navbar from '@/components/global/navbar'
import Footer from '@/components/global/footer'
import MemberBenefit from '@/components/clubpage/memberbenefit'
import Clublist from '@/components/clubpage/clublistmap'
import { usePopup } from '@/components/global/usepopup'
import PopupWrapper from '@/components/global/popupwrapper'

const ClublandingPage = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup()

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar toggleLoginPopup={toggleLoginPopup} />

      {/* Main content */}
      <div className='flex flex-col sm:flex-row items-start gap-4 px-4 py-4'>
        <MemberBenefit />
        <Clublist />
      </div>

      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />

      <div className='w-full bottom-0 w-full'>
        <Footer />
      </div>
    </div>
  )
}

export default ClublandingPage
