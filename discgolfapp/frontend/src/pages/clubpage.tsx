import { useState, useEffect} from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Toolbox from '../components/clubpage/toolbox';
import Login from '@/components/login';
import Register from '@/components/register';

const Clubpage = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
    const [clubData, setClubData] = useState<any>(null); 
    const [loading, setLoading] = useState(true)

    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
    const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
    const closePopup = () => setPopupType(null);

    /*
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                // Sett inn din backend URL her
                const response = await fetch('/clubdata'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setClubData(data); 
            } catch (error) {
                console.error('Error fetching club data:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchClubData(); 
    }, []); 

    if (loading) {
        return <div>Loading...</div>; 
    }
    */

    return (
        <div className="">
            <Navbar toggleLoginPopup={toggleLoginPopup}/>

            <Toolbox /> clubData={clubData}

            {popupType === 'login' && (
                <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
        </div>
    )
}


export default Clubpage;
