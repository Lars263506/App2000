import { useState } from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Toolbox from '../components/clubpage/toolbox';

const Clubpage = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);

    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');

    return (
        <div>
            <Navbar toggleLoginPopup={toggleLoginPopup}/>
            <Toolbox />
        </div>
    )
}

export default Clubpage;
