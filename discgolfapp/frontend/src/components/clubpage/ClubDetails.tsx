import React, { useState, useEffect } from 'react';
import Club from '../../types/club';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import MemberList from './MemberList';
import Announcements from './Announcements';
import Meetings from './Meetings';
import JoinClubModal from './JoinClubModal';
import MemberBenefit from './MemberBenefit';

interface ClubDetailsProps {
    clubData: Club | null;
    setSelectedPage: (page: string) => void;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ clubData, setSelectedPage }) => {
  const { t } = useTranslation();
  const selectedClub = localStorage.getItem('selectedClub');
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkMembership = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const selectedClub = localStorage.getItem('selectedClub');
        const clubId = selectedClub ? JSON.parse(selectedClub)._id : null;
        if (!clubId) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/is-member/${clubId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setIsMember(data.isMember);
        } else {
          setIsMember(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else toast.error(t('clubdetails_ error_fetching_membership_status'));
        setIsMember(false);
      }
    };

    checkMembership();
  }, []);

  const handleJoinClubClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error(t('clubdetails_ please_login'));
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div
      aria-label="Club details"
      className="flex flex-col w-full h-full bg-white shadow-md rounded-lg p-4"
    >
      {isLoggedIn ? (
        isMember ? (
          <div
            aria-label="Container for MemberList and Announcements"
            className="flex flex-row h-full justify-center items-start gap-4 w-full"
          >
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
              aria-label="Meetings Section"
              className="flex flex-col w-1/3 h-full bg-[#E7EFFB] shadow-md rounded-lg p-4"
            >
              <Meetings />
            </div>
          </div>
        ) : (
          <div
            aria-label="Nonmember section"
            className="flex flex-col items-center h-full text-center"
          >
            <h2
              className="text-xl font-bold mb-4"
            >
              {t('clubdetails_become_member')} {
              selectedClub
              ? JSON.parse(selectedClub).name
              : "den valgte klubben"} {t('clubdetails_for_more_info')}
            </h2>
            <div aria-label="Button container" className="flex flex-row gap-6 items-center">
              <button
                onClick={handleJoinClubClick}
                className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700"
              >
                {t('clubdetails_join_club')}
              </button>
              <button
                className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded hover:bg-gray-700"
                onClick={() => setSelectedPage('ClubLanding')}
              >
                {t('clubdetails_back')}
              </button>
            </div>

            {isModalOpen && (
              <JoinClubModal
                clubId={selectedClub ? JSON.parse(selectedClub)._id : ''}
                onClose={() => setIsModalOpen(false)}
              />
            )}

            <div className="mt-4 max-w-[500px] rounded-md bg-[#E7EFFB] p-2">
              <MemberBenefit />
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center min-h-screen">
          <p className="text-lg">{t('clubdetails_sign_in_to_access')}</p>
          <button
            className="px-6 py-3 mt-4 bg-gray-500 text-white text-lg font-semibold rounded hover:bg-gray-700"
            onClick={() => setSelectedPage('ClubLanding')}
          >
            {t('clubdetails_back')}
          </button>
        </div>
      )}
    </div>
  );
}

export default ClubDetails;
