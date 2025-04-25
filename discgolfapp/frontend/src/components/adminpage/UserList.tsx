import React, { useEffect, useState } from 'react';
import User from '../../types/user';
import UserEditModal from './UserEditModal'
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

/**
 * @author Adrian Johansen & Ibrahim Queeum & Lars Andreas
 * @description This component displays a list of users for administration purposes.
 * It allows filtering, editing user details, and updating the user list.
 * Users can be filtered by name, email, or role, and edits are saved to the backend.
 * A modal is used for editing user details, with success and error notifications.
 */

/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

const UserList: React.FC = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 /**
 * Fetches the list of users from the backend and updates the state.
 * Displays an error toast if the fetch operation fails.
 * @author Ibrahim Queeum
 * @function fetchUsers
 */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.status !== 200) {
            toast.error(t('userlist_toast_error_failed_to_fetch_users'));
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(t('userlist_toast_error_error_fetching_users') + error.message);
        } else {
          toast.error(t('userlist_toast_error_error_fetching_users'));
        }
      }
    };

    fetchUsers();
  }, []);

/**
 * Opens the user edit modal for the selected user.
 * @author Ibrahim Queeum
 * @function handleEditUser
 * @param {User} user - The user object to be edited.
 */
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

/**
 * Saves the updated user details to the backend and updates the user list.
 * Displays success or error toasts based on the outcome.
 * @author Ibrahim Queeum
 * @function handleSaveUser
 * @param {User} updatedUser - The updated user object.
 */
  const handleSaveUser = async (updatedUser: User) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (response.status === 200) {
    
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === updatedUser.oldEmail ? updatedUser : user
          )
        );
        toast.success(t('userlist_toast_success_user_details_updated_successfully'));
      } else {
        const errorData = await response.json();
        toast.error(t('userlist_toast_error_updating_user') + errorData.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('userlist_toast_error_updating_user') + error.message);
      } else {
        toast.error(t('userlist_toast_error_updating_user'));
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>{t('userlist_title_user_administration')}</h2>
      <input
        type='text'
        placeholder='Filter users...'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className='mb-4 p-2 border rounded'
      />
      <div>
        {filteredUsers.length > 0 ? (
          <ul>
          {filteredUsers.map((user, index) => (
            <li key={index} className='mb-2 p-4 border-2 border-gray-600 rounded-lg flex justify-between items-center shadow-md'>
              <div>
                <p><strong>{t('userlist_display_name')}:</strong> {user.displayName}</p>
                <p><strong>{t('userlist_email')}:</strong> {user.email}</p>
                <p><strong>{t('userlist_role')}:</strong> {user.role}</p>
              </div>
              <button
                onClick={() => handleEditUser(user)}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                {t('userlist_edit_button')}
              </button>
            </li>
          ))}
        </ul>
        ) : (
          <p>{t('userlist_no_users_found')}</p>
        )}
      </div>
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserList;
