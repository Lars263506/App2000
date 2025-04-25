/**
 * Navigation Component
 * Provides a navigation interface for the front page, allowing users to select different sections of the application.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

/**
 * Props for the Navigation component
 * @typedef {Object} NavigationProps
 * @property {function(string): void} setSelectedPage - Function to set the selected page.
 * @author Andreas Nilsen
 */

import { useTranslation } from 'react-i18next';

/**
 * @author Adrian Johansen
 * @description This component provides the main navigation for the front page.
 * It displays clickable cards for navigating to different sections of the app, such as Play, Courses, Get Started, and Clubs.
 * Each card uses translations for its title and description and includes hover effects for interactivity.
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 */

interface NavigationProps {
  setSelectedPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setSelectedPage }) => {

  const { t } = useTranslation()

  return (
    <div className='max-w-2xl mx-auto my-8 grid grid-cols-1 sm:grid-cols-2 gap-12 py-2'>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 w-[300px] mx-auto'
        onClick={() => setSelectedPage('Play')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_playnow_title")}</h2>
        <p className='mt-2 text-[#2A4470] text-sm'>
        {t("navigation_playnow_description")}
        </p>
      </div>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 w-[300px] mx-auto'
        onClick={() => setSelectedPage('Courses')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_courses_title")}</h2>
        <p className='mt-2 text-[#2A4470] text-sm'>
        {t("navigation_courses_description")}
        </p>
      </div>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 w-[300px] mx-auto'
        onClick={() => setSelectedPage('GetStarted')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_getstarted_title")}</h2>
        <p className='mt-2 text-[#2A4470] text-sm'>
        {t("navigation_getstarted_description")}
        </p>
      </div>

      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 w-[300px] mx-auto'
        onClick={() => setSelectedPage('ClubLanding')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>{t("navigation_clubs_title")}</h2>
        <p className='mt-2 text-[#2A4470] text-sm'>
          {t("navigation_clubs_description")}
        </p>
      </div>
    </div>
  )
}

export default Navigation
