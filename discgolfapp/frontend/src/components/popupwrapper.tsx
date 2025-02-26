import { useState } from 'react';
import Login from '@/components/login';
import Register from '@/components/register';

interface PopupWrapperProps {
    popupType: 'login' | 'register' | null;
    closePopup: () => void;
    toggleRegisterPopup: () => void;
}

const PopupWrapper = ({ popupType, closePopup, toggleRegisterPopup }: PopupWrapperProps) => {
    return (
        <>
            {popupType === 'login' && (
                <Login 
                    togglePopup={closePopup} 
                    toggleRegisterPopup={toggleRegisterPopup} 
                    closePopup={closePopup} 
                />
            )}
            {popupType === 'register' && (
                <Register 
                    togglePopup={toggleRegisterPopup}
                    closePopup={closePopup}  
                />
            )}
        </>
    );
};

export default PopupWrapper;
