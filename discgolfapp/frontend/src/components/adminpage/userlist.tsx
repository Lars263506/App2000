import React, { useEffect, useState } from 'react';
import User from '../../types/user';
import UserEditModal from './usereditmodal';
import { toast } from 'react-toastify';

const UserList: React.FC = () => {
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
            toast.error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
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
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(`Failed to update user: ${errorData.message}`);
      }
      setUsers(users.map(user => (user.email === updatedUser.email ? updatedUser : user)));
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error updating user'); 
      } else {
        toast.error('Error updating user'); 
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
      <h2 className='text-2xl font-bold mb-4'>User Administration</h2>
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
              <li key={index} className='mb-2 p-2 border rounded'>
                <p><strong>Display Name:</strong> {user.displayName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button
                  onClick={() => handleEditUser(user)}
                  className='mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
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
