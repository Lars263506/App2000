import { useState } from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Footer from '@/components/footer';
import CourseList from '@/components/course/courselist';
import { usePopup } from '@/components/usepopup';
import PopupWrapper from '@/components/popupwrapper';

const Field = () => {

    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();

    return (
        <div>
            <Navbar toggleLoginPopup={toggleLoginPopup}/>
            <div className="flex flex-wrap justify-center gap-3">
            </div>
            <CourseList />

            <PopupWrapper
                popupType={popupType}
                closePopup={closePopup}
                toggleRegisterPopup={toggleRegisterPopup}
            />

            <div className='absolute bottom-0 w-full'>
                <Footer />
            </div>
        </div>
    );
}

export default Field;
