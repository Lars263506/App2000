/**
 * Login Component
 * Provides a login interface for users, including functionality for login, logout, and navigation to other pages.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

interface LoginProps {
  togglePopup: () => void
  toggleRegisterPopup: () => void
  closePopup: () => void
  selectedPage: string
  setSelectedPage: (page: string) => void
}

interface LoginResponseData {
  displayName: string
  accessToken: string
  refreshToken: string
  message?: string
}

const Login: React.FC<LoginProps> = ({ togglePopup, toggleRegisterPopup, closePopup, selectedPage, setSelectedPage }) => {
  const { t } = useTranslation()
  const [locked, setLocked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setLoggedInUser(localStorage.getItem('displayName') || '')
    setIsLoggedIn(!!token)
  }, [])

  /**
   * Handles the login process, including API calls and state updates.
   * Displays success or error messages based on the response.
   * 
   * @function handleLogin
   * @param {React.FormEvent} event - The form submission event.
   * @returns {Promise<void>}
   * @author Andreas Nilsen
   */
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (locked) return;

    setLocked(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/login/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 429) {
        toast.error(t('login_toast_error_too_many_requests'));
        return;
      }

      if (response.status !== 200) {
        const errorData = await response.json();
        toast.error(errorData.message ? t(errorData.message) : t('login_toast_error_generic'));
        return;
      }

      const data: LoginResponseData = await response.json();

      // Handle successful login
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('displayName', data.displayName);
      setIsLoggedIn(true);
      toast.success(t('login_toast_success_login', { displayName: data.displayName }));
      setLoggedInUser(data.displayName);
      closePopup();
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('login_toast_error_tryagain'));
      }
    } finally {
      setLocked(false);
      setEmail('');
      setPassword('');
    }
  };

  /**
   * Handles the logout process, including clearing local storage and updating state.
   * Redirects the user to the home page if necessary.
   * 
   * @function handleLogout
   * @returns {void}
   * @author Andreas Nilsen
   */
  const handleLogout = async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast.success(t('login_toast_success_logout'))
    if (selectedPage === 'Admin')
      setSelectedPage('Home')
    else if (selectedPage === 'MyPage')
      setSelectedPage('Home')
    else if (selectedPage === 'Club')
      setSelectedPage('Home')
    window.location.reload()

    setIsLoggedIn(false)
  }

  /**
   * Navigates the user to the "My Page" section.
   * 
   * @function goToMyPage
   * @returns {void}
   * @author Andreas Nilsen
   */
  const goToMyPage = () => {
    setSelectedPage('MyPage')
    closePopup()
  }

  /**
   * Navigates the user to the "Forgot Password" page.
   * 
   * @function handleForgotPassword
   * @returns {void}
   * @author Andreas Nilsen
   */
  const handleForgotPassword = () => {
    setSelectedPage('ForgotpasPage');
    closePopup();
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75'
      onClick={closePopup}
    >
      <div
        className='bg-white p-8 rounded-xl shadow-md w-full max-w-md relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePopup}
          className='absolute top-2 right-2 text-4xl'
        >
          &times;
        </button>
        <header className='text-2xl font-bold text-black text-center mb-8'>
          {isLoggedIn && loggedInUser ? 'Logget inn med bruker ' + loggedInUser : 'Logg inn'}
        </header>
        {isLoggedIn ? (
           <div className="flex flex-col items-center">
           <button
             onClick={() => goToMyPage()}
             className="px-4 py-2 mb-2 rounded bg-[#E7EFFB] hover:bg-blue-700 hover:text-white"
           >
             {t('login_goto_mypage')}
           </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded bg-[#E7EFFB] hover:bg-red-800 hover:text-white">
              {t('login_logout')}
            </button>
          </div>
            )
          : (
            <form className='flex flex-col' onSubmit={handleLogin}>
              <div className='flex flex-col mb-2'>
                <input
                  type='email'
                  className='border p-2 rounded'
                  placeholder='Skriv inn e-post'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='flex flex-col mb-6'>
                <input
                  type='password'
                  className='border p-2 rounded'
                  placeholder='Skriv inn passord'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                type="button"
                onClick={handleForgotPassword}
                className="hover:underline text-black mt-2 text-sm text-center"
              >
                {t('login_forgot_password')}
              </button>
              </div>
              <button
                type='submit'
                className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4'
              >
                {t('login_login')}
              </button>

              <h2 className='text-center mt-8'>{t('login_no_user')}</h2>
              <button
                type='button'
                className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-2'
                onClick={() => {
                  togglePopup()
                  toggleRegisterPopup()
                }}
              >
                {t('login_create_user')}
              </button>
            </form>
            )}
      </div>
    </div>
  )
}

export default Login
