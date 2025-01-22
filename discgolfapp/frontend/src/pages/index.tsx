'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div>
      {/* This is the NavBar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Velkommen til Norges Discgolf-forbund</h1>
        <button
          onClick={togglePopup}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Logg inn
        </button>
      </nav>

      {/* Main content */}
      <div className="p-6">
        <p>Utviklet for Norges Discgolf-forbund av LAB.ai</p>
      </div>

      {/* Popup-window */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Velkommen!</h2>
            <form>
              {/* Login field */}
              <label htmlFor="email" className="block mb-2 text-gray-700">
                E-post
              </label>
              <input
                type="email"
                id="email"
                className="border p-2 w-full mb-4 rounded"
                placeholder="Skriv inn din e-post"
              />
              <label htmlFor="password" className="block mb-2 text-gray-700">
                Passord
              </label>
              <input
                type="password"
                id="password"
                className="border p-2 w-full mb-4 rounded"
                placeholder="Skriv inn ditt passord"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              >
                Logg inn
              </button>
            </form>

            {/* Register here */}
            <div className="mt-4 text-center">
              <p className="text-gray-700">Ikke medlem?</p>
              <button
                onClick={() => router.push('/register')}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Registrer deg her
              </button>
            </div>

            {/* Close-button */}
            <button
              onClick={togglePopup}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
