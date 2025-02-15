import { useState, useEffect} from 'react';
import { useRouter } from 'next/router';

import '../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar';
import Toolbox from '../components/clubpage/toolbox';
import Login from '@/components/login';
import Register from '@/components/register';

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This is the main page for the clubpage. It contains the navbar and the toolbox.
 */

const Clubpage = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);

    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
    const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
    const closePopup = () => {
        setPopupType(null);
        window.location.reload();
    } 

    const router = useRouter();
    const clubId = router.query.clubId as string | undefined; 

    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;

    return (
        <div className="">
            <Navbar toggleLoginPopup={toggleLoginPopup}/>

            <Toolbox clubId={id}/>

            {popupType === 'login' && (
                <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
        </div>
    )
}

export default Clubpage;
