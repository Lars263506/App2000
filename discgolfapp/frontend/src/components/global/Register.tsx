import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../app/globals.css'
import { useTranslation } from 'react-i18next'

/**
 * @author Adrian Johansen and Andreas Nilsen
 * @description This component handles user registration for the application.
 * It provides a form for users to create an account by entering a display name, email, and password.
 * The component validates input, sends the data to the backend, and displays success or error notifications.
 * It also includes options to close the popup or switch to the login form.
 * Register Component
 * Provides a registration interface for users, including functionality for creating a new account.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

/**
 * Props for the Register component
 * @typedef {Object} RegisterProps
 * @property {function(): void} togglePopup - Function to toggle the register popup.
 * @property {function(): void} closePopup - Function to close the popup.
 * @author Andreas Nilsen
 */
interface RegisterProps {
  togglePopup: () => void
  closePopup: () => void
}

const Register: React.FC<RegisterProps> = ({ togglePopup, closePopup }) => {
  const { t } = useTranslation()
  const [locked, setLocked] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  /**
   * Handles the registration process, including API calls and state updates.
   * Displays success or error messages based on the response.
   * 
   * @function handleSubmit
   * @param {React.FormEvent} event - The form submission event.
   * @returns {Promise<void>}
   * @author Andreas Nilsen
   */
  const handleSubmit = async (event: React.FormEvent) => {
    if (locked) return

    setLocked(true)
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/'

    event.preventDefault()
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName,
          email,
          password
        })
      })
      const data = await response.json()
      if (response.status !== 201) {
        toast.error(data.message)
      } else {
        toast.success(t('register_toast_success_user_created'))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('register_toast_error_user_creation'))
      }
    } finally {
      setLocked(false)
      setDisplayName('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75'
      onClick={closePopup}
    >
      <div
        className='bg-white p-8 rounded shadow-md w-full max-w-md relative'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='bg-white p-8 rounded shadow-md w-full max-w-md relative'>
          <button
            onClick={closePopup}
            className='absolute top-2 right-2 text-4xl'
          >
            &times;
          </button>
          <h2 className='text-2xl font-bold mb-12 text-center'>{t('register_register')}</h2>
          <h2 className='font-bold mb-2 text-left'>{t('register_make_user')}</h2>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className='flex flex-col mb-3'>
              <input
                type='text'
                className='border p-2 rounded'
                placeholder='Skriv inn et kallenavn'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className='flex flex-col mb-3'>
              <input
                type='email'
                className='border p-2 rounded'
                placeholder='Skriv inn e-post'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='flex flex-col'>
              <input
                type='password'
                className='border p-2 rounded'
                placeholder='Velg et passord'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2'
            >
              {t('register_register')}
            </button>
            <button
              type='button'
              className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mt-12'
              onClick={togglePopup}
            >
              {t('register_already_have_account')}
            </button>
            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
