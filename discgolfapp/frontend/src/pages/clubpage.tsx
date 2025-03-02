import { useState, useEffect} from 'react';
import { useRouter } from 'next/router';

import '../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/global/navbar';
import Toolbox from '../components/clubpage/toolbox';
import PopupWrapper from '@/components/global/popupwrapper';
import { usePopup } from '@/components/global/usepopup';

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This is the main page for the clubpage. It contains the navbar and the toolbox.
 */

const Clubpage = () => {
    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
    const [view, setView] = useState<"nonmember" | "member" | "clubowner">("nonmember");

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
        if (id) getView();
    }, [id]);

    return (
        <div className="">
            <Navbar toggleLoginPopup={toggleLoginPopup}/>

            <Toolbox clubId={id}/>

            <PopupWrapper
                popupType={popupType}
                closePopup={closePopup}
                toggleRegisterPopup={toggleRegisterPopup}
            />
        </div>
    )
}

export default Clubpage;
