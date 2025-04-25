/**
 * @description Translated by Ibrahim Queeum using i18next.
 */

/**
 * @author
 * Lars Andreas Strand
 * @description This component displays a list of members in a club. It allows:
 * - Club owners to view and edit member positions.
 * - Members to view their roles and positions.
 * - Fetching member data from the backend.
 * - Updating member positions via the backend.
 * The component also handles loading states and error handling for API requests.
 */

/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Member from '../../types/member';
import Club from '../../types/club';
import { useTranslation } from 'react-i18next';

interface MemberListProps {
  /**
   * @property clubData The data of the selected club, passed as a prop.
   */
  clubData: Club | null;
}

const MemberList: React.FC<MemberListProps> = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  /**
   * Fetches the list of members from the backend.
   * Updates the `members` state with the fetched data.
   * Displays a toast notification in case of errors.
   */
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
        if (error instanceof Error) {
          toast.error(t('error_fetch_members') + error.message);
        } else {
          toast.error(t('error_fetch_members'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [t]);

  /**
   * Handles updating the position of a member.
   * Sends a PATCH request to the backend to update the member's position.
   * Updates the `members` state locally to reflect the change.
   * Displays success or error notifications based on the API response.
   *
   * @param index The index of the member in the `members` array.
   * @param newPosition The new position to assign to the member.
   */
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
        toast.success(t('memberlist_position_updated'));
      } else if (response.status === 404) {
        toast.error(t('memberlist_endpoint_not_found'));
      } else {
        throw new Error(`${t('memberlist_server_answered')} ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || t('memberlist_error'));
      } else {
        toast.error(t('memberlist_error'));
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full h-full">
      {/* Title */}
      <h2 className="text-xl font-bold mb-2 text-black">{t('memberlist_title')}</h2>

      {/* Loading State */}
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
                    : '/images/default-profile.png'
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
                    className="text-sm text-gray-800 italic border border-gray-300 rounded px-2 py-1 mt-1"
                    placeholder="Skriv inn position"
                  />
                ) : (
                  <p className="text-sm text-gray-600 italic mt-1">
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
