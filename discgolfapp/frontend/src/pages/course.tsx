import { useState } from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Footer from '@/components/footer';
import Login from '@/components/login';
import Register from '@/components/register';
import CourseList from '@/components/course/courselist';

const Field = () => {

const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
const closePopup = () => setPopupType(null);

    return (
        <div>
            <Navbar toggleLoginPopup={toggleLoginPopup}/>
            <div className="flex flex-wrap justify-center gap-3">
            </div>
            <CourseList />
            {popupType === 'login' && (
            <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
            )}
            {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
            <div className='absolute bottom-0 w-full'>
                <Footer />
            </div>
        </div>
    );
}

export default Field;
