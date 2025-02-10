import { useState } from 'react';

import '../app/globals.css';
import MemberBenefit from '@/components/clubpage/memberbenefit';
import Clublist from '@/components/clubpage/clublistmap';
import Navbar from '../components/navbar';
import Footer from '@/components/footer';
import Login from '@/components/login';
import Register from '@/components/register';
import router from 'next/router';


const Clublanding = () => {

const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
const closePopup = () => setPopupType(null);
  
    return (
        <div>
            <Navbar toggleLoginPopup={toggleLoginPopup}/>
            <div className="flex flex-wrap justify-left gap-3 min-h-screen">
                <div className="w-96 h-72 p-4 bg-transparen  rounded  items-center justify-center shadow-none">
                    <MemberBenefit />
                </div>
                <div className="w-97 h-72 p-4 bg-transparen  rounded  items-center justify-center shadow-none">
                    <Clublist />
                </div>
            </div>
            <button
                        onClick={() => router.push('/')}
                        className="px-2 py-1 bg-black text-white rounded mt-32"
                    >
                        Til forsiden
                    </button>
            {popupType === 'login' && (
            <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
            <Footer />
        </div>
    );
}

export default Clublanding;
