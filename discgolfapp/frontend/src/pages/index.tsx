import { useEffect, useState } from 'react';
import Login from '@/components/login';
import Register from '@/components/register';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import FirstBox from '@/components/firstbox';
import SecondBox from '@/components/secondbox';

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

      <FirstBox
        images={images}
        currentImageIndex={currentImageIndex}
        toggleBox={toggleBox}
        isBoxOpen={isBoxOpen}
      />

      <SecondBox
        toggleSecondBox={toggleSecondBox}
        isSecondBoxOpen={isSecondBoxOpen}
      />

      {popupType === 'login' && (
        <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
      )}
      {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
      <Footer />
    </div>
  );
};

export default Home;