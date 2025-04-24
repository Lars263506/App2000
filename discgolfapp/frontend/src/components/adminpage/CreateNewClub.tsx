import React, { useRef, useState, useEffect } from 'react';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

/**
 * @author Adrian Johansen
 * @description This component provides a form for creating a new club.
 * It allows users to input club details such as name, owner, description, and contact information.
 * The form validates required fields and submits the data to the backend.
 * If the creation is successful, a success toast is displayed; otherwise, an error toast is shown.
 * The component also handles closing the modal when clicking outside of it.
 */

interface CreateNewClubProps {
  onClose: () => void;
}

const CreateNewClub: React.FC<CreateNewClubProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    clubOwner: '',
    description: '',
    address: '',
    zipCode: '',
    websiteURL: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`;
    const accessToken = localStorage.getItem('accessToken');

    e.preventDefault();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success(t('createnewclub_toast_success_club_created'));
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t('createnewclub_toast_error_club_creation_failed'));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else
      toast.error(t('createnewclub_toast_error_club_creation_failed'));
    }
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl mb-4">{t('createnewclub_title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {t('createnewclub_label_name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t('createnewclub_placeholder_name')}
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="clubOwner">
              {t('createnewclub_label_club_owner')}
            </label>
            <input
              type="text"
              id="clubOwner"
              name="clubOwner"
              placeholder={t('createnewclub_placeholder_clubowner')}
              value={formData.clubOwner}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              {t('createnewclub_label_description')}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder={t('createnewclub_placeholder_description')}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              {t('createnewclub_label_address')}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder={t('createnewclub_placeholder_address')}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
              {t('createnewclub_label_zip_code')}
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder={t('createnewclub_placeholder_zip_code')}
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="websiteURL">
              {t('createnewclub_label_website_url')}
            </label>
            <input
              type="url"
              id="websiteURL"
              name="websiteURL"
              placeholder={t('createnewclub_placeholder_website_url')}
              value={formData.websiteURL}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t('createnewclub_label_email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t('createnewclub_placeholder_email')}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              {t('createnewclub_label_phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder={t('createnewclub_placeholder_phone')}
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="p-2 bg-gray-500 text-white rounded mr-2"
              onClick={onClose}
            >
              {t('createnewclub_button_cancel')}
            </button>
            <button type="submit" className="p-2 bg-blue-600 text-white rounded">
              {t('createnewclub_button_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewClub;
