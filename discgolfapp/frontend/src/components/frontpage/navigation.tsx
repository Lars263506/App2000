import { useTranslation } from 'react-i18next';

interface NavigationProps {
  setSelectedPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setSelectedPage }) => {

  const { t } = useTranslation()

  return (
    <div className='max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-2'>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('GetStarted')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_getstarted_title")}</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
        {t("navigation_getstarted_description")}
        </p>
      </div>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('Courses')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_courses_title")}</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
        {t("navigation_courses_description")}
        </p>
      </div>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('ClubLanding')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_clubs_title")}</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          {t("navigation_clubs_description")}
        </p>
      </div>
    </div>
  )
}

export default Navigation
