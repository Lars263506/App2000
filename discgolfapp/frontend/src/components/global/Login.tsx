import { set } from 'mongoose'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface LoginProps {
  togglePopup: () => void
  toggleRegisterPopup: () => void
  closePopup: () => void
  setSelectedPage: (page: string) => void
}

interface LoginResponseData {
  displayName: string
  accessToken: string
  refreshToken: string
  message?: string
}

const Login: React.FC<LoginProps> = ({ togglePopup, toggleRegisterPopup, closePopup, setSelectedPage }) => {
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (locked) return

    setLocked(true)
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/login/'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data: LoginResponseData = await response.json()

      if (response.status !== 200) {
        toast.error(data.message)

      } else {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        setIsLoggedIn(true)
        toast.success('Logget inn med bruker: ' + data.displayName);
        setLoggedInUser(data.displayName)
        closePopup()
        window.location.reload()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Et problem oppstod. Vennligst prøv igjen senere.')
      }
    } finally {
      setLocked(false)
      setEmail('')
      setPassword('')
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast.success('Du er logget ut.')
    window.location.reload()

    setIsLoggedIn(false)
  }

  const goToMyPage = () => {
    setSelectedPage('MyPage')
    closePopup()
  }

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
        className='bg-white p-8 rounded shadow-md w-full max-w-md relative'
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
             className="px-4 py-2 rounded hover:bg-blue-700 mb-2"
           >
             Min Side
           </button>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-800">
              Logg ut
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
                Glemt passord?
              </button>
              </div>
              <button
                type='submit'
                className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4'
              >
                Logg inn
              </button>

              <h2 className='text-center mt-8'>Har du ikke bruker?</h2>
              <button
                type='button'
                className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-2'
                onClick={() => {
                  togglePopup()
                  toggleRegisterPopup()
                }}
              >
                Registrer deg
              </button>
            </form>
            )}
      </div>
    </div>
  )
}

export default Login
