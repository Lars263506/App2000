import React from 'react';
import UserList from './UserList';

/**
 * @author Lars Andreas & Ibrahim Queeum
 * @description This component serves as a container for the UserList component.
 * It is used to display the list of users in the admin page.
 */
const UserAdminDetails: React.FC = () => {
  return (
    <div className='p-4'>
      <UserList />
    </div>
  );
};

export default UserAdminDetails;
