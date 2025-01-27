'use client';

import { useEffect, useState } from 'react';
import Login from '@/components/login';
import Register from '@/components/register';
import Navbar from '@/components/navbar';
import Image from 'next/image';

const Home = () => {
  const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isSecondBoxOpen, setIsSecondBoxOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
  const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
  const closePopup = () => setPopupType(null);
  const toggleBox = () => setIsBoxOpen(!isBoxOpen);
  const toggleSecondBox = () => setIsSecondBoxOpen(!isSecondBoxOpen);

  const images = [
    '/golf1.webp',
    '/golf2.webp',
    '/golf3.webp',
    '/golf4.webp',
    '/golf5.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <Navbar toggleLoginPopup={toggleLoginPopup} />

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
                <Image src={images[currentImageIndex]} alt="Placeholder" width={300} height={300} className="w-full h-full object-cover rounded" />
              </div>
              <div className="bg-gray-100 p-4 rounded shadow w-90 h-80">
                <h2 className="text-xl font-bold text-black">Om Discgolf</h2>
                <p className="mt-2 text-black">
                  Discgolf er en morsom og utfordrende sport som ligner på vanlig golf,<br></br> men i stedet for å bruke en ball og kølle, bruker du en disc (frisbee). <br></br> Målet er å kaste discen fra startpunktet til kurven på færrest mulig kast.
                </p>
                <p className="mt-2 text-black">
                  Discgolfbaner varierer i lengde og vanskelighetsgrad.<br></br> Noen baner har hindringer som trær, busker og vann som gjør spillet mer utfordrende. <br></br> Prøv å følge etikette på banen for en god opplevelse.
                </p>
                <button className='mt-16 bg-black text-white px-4 py-2 rounded hover:bg-blue-600"'>Kom i gang</button>
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