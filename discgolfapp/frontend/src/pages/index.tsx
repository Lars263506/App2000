import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import DiscgolfInfo from '@/components/frontpage/discgolfinfo';
import Navigation from '@/components/frontpage/navigation';
import PopupWrapper from '@/components/popupwrapper';
import { usePopup } from '@/components/usepopup';

/**
 * @author Andreas Nilsen
 * @description Line: 23-27, Generated images from ChatGPT.
 */

const Home = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <Navbar toggleLoginPopup={toggleLoginPopup}/>

      <DiscgolfInfo
        images={images}
        currentImageIndex={currentImageIndex}
      />

      <Navigation />

      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />

      <Footer />
    </div>
  );
};

export default Home;
