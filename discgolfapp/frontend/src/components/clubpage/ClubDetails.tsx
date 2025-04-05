import { Club } from '../../types/club';

import { useTranslation } from 'react-i18next';
import MemberList from './memberlist';
import Announcements from './announcements';

interface ClubDetailsProps {
    clubData: Club | null;
    setSelectedPage: (page: string) => void;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ clubData, setSelectedPage }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label="Club details"
      className="flex flex-col w-full h-full bg-white shadow-md rounded-lg p-4"
    >
      <div
        aria-label="Container for MemberList, Announcements, and News"
        className="flex flex-row h-full justify-between items-start gap-4 w-full"
      >
        {/* MemberList Section */}
        <div
          aria-label="MemberList Section"
          className="flex flex-col w-1/3 h-full bg-[#E7EFFB] shadow-md rounded-lg p-4"
        >
          <MemberList clubData={clubData} />
        </div>

        <div
          aria-label="Announcements Section"
          className="flex flex-col w-1/3 h-full bg-[#E7EFFB] shadow-md rounded-lg p-4"
        >
          <Announcements />
        </div>

        <div
          aria-label="News Section"
          className="flex flex-col w-1/3 h-full bg-[#E7EFFB] shadow-md rounded-lg p-4"
        >
          {/* Uncomment when News component is ready */}
          {/* <News clubData={clubData} /> */}
          <h2 className="text-lg font-bold">{t("clubdetails_news")}</h2>
          <p>{t("clubdetails_no_news")}</p>
        </div>
      </div>
    </div>
  )
}

export default ClubDetails
