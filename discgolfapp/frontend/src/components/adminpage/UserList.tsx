import React, { useEffect, useState } from 'react';
import User from '../../types/user';
import UserEditModal from './UserEditModal'
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

const UserList: React.FC = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        toast.error(t('userlist_toast_error_error_fetching_users'));
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

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
        // Update the user list in the frontend
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === updatedUser.oldEmail ? updatedUser : user
          )
        );
        toast.success(t('userlist_toast_success_user_details_updated_successfully'));
      } else {
        const errorData = await response.json();
        toast.error(t('userlist_toast_error_error updating user: ' + errorData.message));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('userlist_toast_error_error_updating_user: ' + error.message));
      } else {
        toast.error('userlist_toast_error_error_updating_user: ');
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
