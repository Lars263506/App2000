import React, { useRef, useState, useEffect } from 'react';

import { toast } from 'react-toastify';

interface CreateNewClubProps {
  onClose: () => void;
}

const CreateNewClub: React.FC<CreateNewClubProps> = ({ onClose }) => {
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
        toast.success('Club created successfully!');
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create club. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred while creating the club. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Create New Club</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Club Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Must be unique and not empty"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="clubOwner">
              Club Owner
            </label>
            <input
              type="text"
              id="clubOwner"
              name="clubOwner"
              placeholder="Insert club owner's display name"
              value={formData.clubOwner}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Insert a short description of the club"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Insert the club's address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="Insert the club's zip code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="websiteURL">
              Website URL
            </label>
            <input
              type="url"
              id="websiteURL"
              name="websiteURL"
              placeholder="Insert the club's website URL"
              value={formData.websiteURL}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Insert the club's email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Insert the club's phone number"
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
              Cancel
            </button>
            <button type="submit" className="p-2 bg-blue-600 text-white rounded">
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewClub;