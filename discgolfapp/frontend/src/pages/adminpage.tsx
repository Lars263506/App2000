import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import NavBar from '../components/global/navbar';
import Footer from '../components/global/footer';
import { usePopup } from '@/components/global/usepopup'
import PopupWrapper from '@/components/global/popupwrapper'
import Settings from '@/components/adminpage/settings'

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
*/

const AdminPage: React.FC = () => {
    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup, toggleMyPagePopup } = usePopup()

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">

            {/* Navbar */}
            <div className="h-[15vh]">
                <NavBar toggleLoginPopup={toggleLoginPopup}/>
            </div>

            {/* Main content */}
            <div className="h-[75vh]">
                <Settings />
            </div>

            {/* Footer */}
            <div className="h-[10vh]">
                <Footer />
            </div>

            {/* Popup */}
            <PopupWrapper
                popupType={popupType}
                closePopup={closePopup}
                toggleRegisterPopup={toggleRegisterPopup}
                toggleMyPagePopup={toggleMyPagePopup}
            />

            <ToastContainer />
        </div>
    );
};

export default AdminPage;
