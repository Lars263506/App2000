import React, { useEffect, useState } from 'react';
import Button from '../global/Button';
import { toast } from 'react-toastify';

const Announcements = () => {
  const [content, setContent] = useState<string[]>([]); // Array of announcements
  const [editRights, setEditRights] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<number | null>(null); // Index of the announcement being edited
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const accessToken = localStorage.getItem('accessToken');
  const selectedClub = localStorage.getItem('selectedClub');
  const selectedClubId = selectedClub ? JSON.parse(selectedClub)._id : null;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    checkEditRights();
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/announcements/';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setContent(data.filter((announcement) => typeof announcement === 'string')); // Filter out invalid values
        }
      } else {
        toast.error('Error fetching announcements:');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const checkEditRights = async () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/permissions';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setEditRights(data.editRights);
      } else {
        setEditRights(false);
      }
    } catch (error) {
      console.error('Error fetching edit rights:', error);
    }
  };

  const handleCreateAnnouncement = () => {
    setIsCreating(true);
  };

  const handleSubmitNewAnnouncement = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/announcements/' + selectedClubId;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content[content.length - 1] }),
      });

      if (response.status === 201) {
        toast.success('Announcement created successfully!');
        setIsCreating(false);
        fetchAnnouncements();
      } else {
        console.error('Error creating announcement:', response.statusText);
        toast.error('Failed to create announcement.');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement.');
    }
  };

  const handleEditAnnouncement = (index: number) => {
    setIsEditing(index);
  };

  const handleSubmitEdit = async (index: number) => {
    try {
      const url = baseUrl
      + "/clubpage/announcements/"
      + (selectedClub ? JSON.parse(selectedClub)._id : '')
      + "/"
      + index;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content[index] }),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success(data.mssg);
        setIsEditing(null);
        fetchAnnouncements();
      } else {
        console.error('Error updating announcement:', response.statusText);
        toast.error('Failed to update announcement.');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement.');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full h-full max-h-100 overflow-y-auto">
      <h2 className="text-xl font-bold mb-2 text-black">Kunngjøringer</h2>

      {editRights && !isCreating && (
        <Button
          className="mb-4 p-2 text-white"
          onClick={handleCreateAnnouncement}
        >
          Ny kunngjøring
        </Button>
      )}

      {isCreating ? (
        <>
          <textarea
            className="p-2 border rounded-md text-black w-full min-h-[100px]"
            placeholder="Skriv inn kunngjøring..."
            value={isCreating ? content[content.length - 1] || '' : ''} // Start with no value
            onChange={(e) => {
              const newContent = [...content];
              if (isCreating) {
                newContent[content.length - 1] = e.target.value;
              }
              setContent(newContent);
            }}
          />
          <Button
            className="mt-2 p-2 text-white"
            onClick={handleSubmitNewAnnouncement}
            disabled={!content[content.length - 1]?.trim()}
          >
            Send inn
          </Button>
        </>
      ) : (
        content.map((announcement, index) => (
          <div
            key={index}
            className="p-2 border-b last:border-b-0 text-black w-full min-h-[50px] flex items-center"
          >
            {isEditing === index ? (
              <>
                <textarea
                  className="mr-2 p-2 border rounded-md text-black w-full min-h-[50px]"
                  value={announcement}
                  onChange={(e) => {
                    const newContent = [...content];
                    newContent[index] = e.target.value;
                    setContent(newContent);
                  }}
                />
                <Button
                  className="mt-2 p-2 text-white"
                  onClick={() => handleSubmitEdit(index)}
                >
                  Oppdater
                </Button>
              </>
            ) : (
              <p
                className={`flex-grow ${
                  editRights ? 'cursor-pointer' : ''
                }`}
                onClick={editRights ? () => handleEditAnnouncement(index) : undefined}
              >
                {(announcement || '').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
