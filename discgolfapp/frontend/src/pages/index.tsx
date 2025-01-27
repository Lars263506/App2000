'use client';

import { useState } from 'react';
import Login from '@/components/login';
import Register from '@/components/register';
import Image from 'next/image';

const Home = () => {
  const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isSecondBoxOpen, setIsSecondBoxOpen] = useState(true);

  const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
  const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
  const closePopup = () => setPopupType(null);
  const toggleBox = () => setIsBoxOpen(!isBoxOpen);
  const toggleSecondBox = () => setIsSecondBoxOpen(!isSecondBoxOpen);

  return (
    <div>
      <nav className="bg-gray-600 text-white p-4 flex justify-center">
        <div className="flex items-center w-3/4">
          <div className="flex items-center mr-4">
            <Image src="/logo1.png" alt="Logo" width={32} height={32} className="mr-2"/>
            <h1 className="text-xl font-bold">Norges Discgolf-forbund</h1>
          </div>
          <div className="flex items-center w-1/2 mx-4">
            <input
              type="text"
              placeholder="Søk..."
              className="w-full px-4 py-2 rounded bg-gray-300 text-black placeholder-black"
            />
          </div>
          <div className="flex items-center ml-4 space-x-2">
            <Image
              src="/bx-user-circle.svg"
              alt="Profil"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
              onClick={toggleLoginPopup}
            />
            <Image
              src="/bx-world.svg"
              alt="Flagg"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </div>
        </div>
      </nav>

      <div className="w-full mx-auto mt-4 p-4">
        <div className={`relative bg-white border border-gray-300 rounded shadow-md ${isBoxOpen ? 'h-auto' : 'h-20'} overflow-hidden transition-all duration-300`}>
          <button onClick={toggleBox} className="absolute left-0 top-0 mt-2 ml-2 bg-gray-200 rounded-full p-2">
            <svg className={`w-6 h-6 transform ${isBoxOpen ? 'rotate-90' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <div className={`p-4 ${isBoxOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gray-100 p-4 rounded shadow w-80 h-80">
                <Image src="/path/to/your-image.jpg" alt="Placeholder" width={300} height={300} className="w-full h-full object-cover rounded" />
              </div>
              <div className="bg-gray-100 p-4 rounded shadow w-90 h-80">
                <h2 className="text-xl font-bold text-black">Om Discgolf</h2>
                <p className="mt-2 text-black">Her kan man lære seg og spille discgolf.</p>
                <button className="mt-48 bg-black text-white px-4 py-2 rounded hover:bg-blue-600">Kom i gang</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto mt-4 p-4">
      <div className={`relative bg-white border border-gray-300 rounded shadow-md ${isSecondBoxOpen ? 'h-auto' : 'h-20'} overflow-hidden transition-all duration-300`}>
        <button onClick={toggleSecondBox} className="absolute left-0 top-0 mt-2 ml-2 bg-gray-200 rounded-full p-2">
          <svg className={`w-6 h-6 transform ${isSecondBoxOpen ? 'rotate-90' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <div className={`p-4 ${isSecondBoxOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer">
              <h2 className="text-3xl font-bold text-black">Spill nå</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer">
              <h2 className="text-3xl font-bold text-black">Baner</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer">
              <h2 className="text-3xl font-bold text-black">Klubber</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

      {popupType === 'login' && (
        <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
      )}
      {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
    </div>
  );
};

export default Home;