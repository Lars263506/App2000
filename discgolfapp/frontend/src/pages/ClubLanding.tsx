'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Login from '@/components/login';
import Register from '@/components/register';
import User from '@/components/user';
import Member from '@/components/member';
import ClubOwner from '@/components/clubowner';

const ClubLanding = () => {
    const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
  
    
    const [userRole, setUserRole] = useState<'user' | 'member' | 'clubowner'>('user');
  
    const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
    const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
    const closePopup = () => setPopupType(null);
  
    return (
      <div>
        <Navbar toggleLoginPopup={toggleLoginPopup} />
  
        <div className="container mx-auto mt-8 p-4">
          {userRole === 'user' && <User toggleRegisterPopup={toggleRegisterPopup} />}
          {userRole === 'member' && <Member />}
          {userRole === 'clubowner' && <ClubOwner />}
        </div>
  
        {/* Popups */}
        {popupType === 'login' && (
          <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
        )}
        {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
  
      </div>
    );
  };
  
  export default ClubLanding;
  