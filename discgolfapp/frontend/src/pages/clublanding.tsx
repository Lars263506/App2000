import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MemberBenefit from '@/components/clubpage/memberbenefit';
import Clublist from '@/components/clubpage/clublistmap';
import { usePopup } from '@/components/usepopup';
import PopupWrapper from '@/components/popupwrapper';

const Clublanding = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();

  return (
    <div className=  "min-h-screen flex flex-col">
      <Navbar toggleLoginPopup={toggleLoginPopup} />

      {/* Main content */}
      <div className="flex flex-col sm:flex-row items-start gap-4 px-4 py-4">
        <MemberBenefit />
        <Clublist />
      </div>
      

      <PopupWrapper
                popupType={popupType}
                closePopup={closePopup}
                toggleRegisterPopup={toggleRegisterPopup}
            />

<Footer />  
    </div>
  );
};

export default Clublanding;
