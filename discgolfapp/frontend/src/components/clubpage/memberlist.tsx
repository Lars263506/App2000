import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Member from '../../types/member';
import { Club } from '../../types/club';
import { useTranslation } from 'react-i18next';

interface MemberListProps {
  clubData: Club | null;
}

const MemberList: React.FC<MemberListProps> = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/members';

      try {
        setLoading(true);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        });

        if (response.status === 200) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            setMembers(data);
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error(t('error_fetch_members'));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full h-full">
      <h2 className="text-xl font-bold mb-2 text-black">{t('memberlist_title')}</h2>
      {loading ? (
        <p className="text-gray-500">{t('memberlist_loading')}</p>
      ) : members.length > 0 ? (
        <ul className="list-none pl-0 text-black">
          {members.map((member, index) => (
            <li
              key={member.displayName || index.toString()}
              className="flex items-center py-4 border-b last:border-b-0"
            >
              {/* Profile Image */}
              <img
                src={
                  member.profilePicture
                    ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/profile-image/${member.profilePicture}`
                    : '/images/default-profile.png' // Fallback image
                }
                alt={member.displayName || t('memberlist_unknown')}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />

              {/* Member Info */}
              <div>
                <p className="font-semibold">
                  {member.displayName || t('memberlist_unknown')}
                </p>
                <p className="text-sm text-gray-600">
                  {member.role === 'Admin'
                    ? 'Admin/Member'
                    : member.role || t('memberlist_unknown_role')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t('memberlist_nomembers')}</p>
      )}
    </div>
  );
};

export default MemberList;
