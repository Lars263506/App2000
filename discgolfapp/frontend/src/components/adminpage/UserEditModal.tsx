import React, { useState, useEffect } from 'react';
import User from '../../types/user';

import { useTranslation } from 'react-i18next';

/**
 * @author: Ibrahim Queeum & Lars Andreas
 * @description This component represents a modal for editing user details. 
 * It allows administrators to update a user's display name, email, and role.
 * 
 * @component
 * @param {UserEditModalProps} props - The props for the UserEditModal component.
 * @param {User} props.user - The user object containing the current user details.
 * @param {boolean} props.isOpen - A flag indicating whether the modal is open.
 * @param {() => void} props.onClose - A function to close the modal.
 * @param {(updatedUser: User) => void} props.onSave - A function to save the updated user details.
 */

interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setDisplayName(user.displayName);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  /**
   * @description Handles saving the updated user details.
   */

  const handleSave = () => {
    const updatedUser = { ...user, displayName, email, role, oldEmail: user.email }; 
    onSave(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">{t("usereditmodal_edit_user")}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("usereditmodal_display_name")}</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("usereditmodal_email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("usereditmodal_role")}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="user">{t("usereditmodal_user")}</option>
            <option value="admin">{t("usereditmodal_admin")}</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t("usereditmodal_save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
