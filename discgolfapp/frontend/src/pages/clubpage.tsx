import { useState, useEffect, Component} from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

import '../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar';
import Toolbox from '../components/clubpage/toolbox';
import Login from '@/components/login';
import Register from '@/components/register';

type ClubData = {
    id: string;
    name: string;
    description: string;
    address: string;
    zipCode: string;
    websiteURL: string;
    email: string;
    phone: string;
};

const Clubpage = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
    const [clubData, setClubData] = useState<ClubData | null>(null); 
    const [loading, setLoading] = useState(true)

    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
    const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
    const closePopup = () => setPopupType(null);

    const router = useRouter();
    const clubId = router.query.clubId as string | undefined; 

    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/' + id;

    useEffect(() => {
        const fetchClubData = async () => {
            try { 
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    }
                }); 

                if (response.ok) {
                    toast.success('Data fetched successfully');
                }
                else {
                    toast.error('Failed to fetch data');
                }
                console.log(response);
                const data = await response.json();
                setClubData(data);
            } catch (error: unknown) { 
                if (error instanceof Error) 
                    toast.error(error.message);
            } finally {
                setLoading(false); 
            }
};

        fetchClubData(); 
    }, []); 

    if (loading) {
        return <div>Loading...</div>; 
    }
    

    return (
        <div className="">
            <Navbar toggleLoginPopup={toggleLoginPopup}/>

            {clubData && (
                <Toolbox 
                    id={clubData.id}
                    name={clubData.name}
                    description={clubData.description}
                    address={clubData.address}
                    zipCode={clubData.zipCode}
                    websiteURL={clubData.websiteURL}
                    email={clubData.email}
                    phone={clubData.phone}
                />
            )}

            {popupType === 'login' && (
                <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
            <ToastContainer />
        </div>
    )
}


export default Clubpage;
