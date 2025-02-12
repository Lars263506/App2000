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

type Component = {
    type: string;
    uniqueId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    _id?: string;
};

const Clubpage = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
    const [view, setView] = useState<"nonmember" | "member" | "clubowner">("nonmember");

    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
    const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
    const closePopup = () => setPopupType(null);
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

    const router = useRouter();
    const clubId = router.query.clubId as string | undefined; 

    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;

    const getView = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/view';
                
        const response = await fetch(url, {
            method: 'GET',
            headers: accessToken ? { 'Authorization': 'Bearer ' + accessToken } : {},
        });

        const data = await response.json();
        setView(data.view);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [id]);

    useEffect(() => {
        if (id) getView();
    }, [id]);

    return (
        <div className="">
            <Navbar toggleLoginPopup={toggleLoginPopup}/>

            <Toolbox clubId={clubId} view={view}/>

            {popupType === 'login' && (
                <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
        </div>
    )
}


export default Clubpage;
