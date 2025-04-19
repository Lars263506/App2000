import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Member from '../../types/member';
import Club from '../../types/club';
import { useTranslation } from 'react-i18next';

interface MemberListProps {
  clubData: Club | null;
}

const MemberList: React.FC<MemberListProps> = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      setUserRole(role);

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
          setMembers(data);
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

  const handlePositionChange = async (index: number, newPosition: string) => {
    const updatedMembers = [...members];
    updatedMembers[index].position = newPosition;
    setMembers(updatedMembers);

    const accessToken = localStorage.getItem('accessToken');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/members/position`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          displayName: updatedMembers[index].displayName,
          position: newPosition,
        }),
      });

      if (response.status === 204 || response.status === 200) {
        toast.success('Position oppdatert!');
      } else if (response.status === 404) {
        toast.error('Endepunktet ble ikke funnet (404). Sjekk backend-konfigurasjonen.');
      } else {
        throw new Error(`Server svarte med status: ${response.status}`);
      }

    } catch (error) {
      console.error(error);
      toast.error('Feil ved lagring av position.');
    }
  };

  return (
    <div className="w-full h-full p-4 border rounded-lg shadow-md bg-white">
      <h2 className="mb-2 text-xl font-bold text-black">{t('memberlist_title')}</h2>
      {loading ? (
        <p className="text-gray-500">{t('memberlist_loading')}</p>
      ) : members.length > 0 ? (
        <ul className="pl-0 list-none text-black">
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
                    : '/images/default-profile.png'
                }
                alt={member.displayName || t('memberlist_unknown')}
                className="w-12 h-12 mr-4 rounded-full object-cover"
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

                {/* Editable position if club owner */}
                {userRole === 'Clubowner' ? (
                  <input
                    type="text"
                    value={member.position || ''}
                    onChange={(e) => {
                      const updatedMembers = [...members];
                      updatedMembers[index].position = e.target.value;
                      setMembers(updatedMembers);
                    }}
                    onBlur={(e) => handlePositionChange(index, e.target.value)}
                    className="mt-1 px-2 py-1 text-sm text-gray-800 italic border border-gray-300 rounded"
                    placeholder="Skriv inn position"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-600 italic">
                    {member.position ? `Position: ${member.position}` : ''}
                  </p>
                )}
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
