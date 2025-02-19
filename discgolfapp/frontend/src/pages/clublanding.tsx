import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Login from '@/components/login';
import Register from '@/components/register';
import MemberBenefit from '@/components/clubpage/memberbenefit';
import Clublist from '@/components/clubpage/clublistmap';

const Clublanding = () => {
  const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);

  const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
  const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
  const closePopup = () => setPopupType(null);

  return (
    <div className=  "min-h-screen flex flex-col">
      <Navbar toggleLoginPopup={toggleLoginPopup} />

      {/* Hovedinnhold */}
      <div className="flex flex-col sm:flex-row items-start gap-4 px-4 py-4">
        <MemberBenefit />
        <Clublist />
      </div>
      

      {/* Popup-modaler */}
      {popupType === 'login' && (
        <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
      )}
      {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}

<Footer />  
    </div>
  );
};

export default Clublanding;
