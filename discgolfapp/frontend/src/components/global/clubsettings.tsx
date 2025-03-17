import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { Club } from '../../types/club'

interface ClubDetailsProps {
  selectedClub: Club | null;
}

const ClubSettings: React.FC<ClubDetailsProps> = ({ selectedClub }) => {

    const [club, setClub] = useState<Club | null>(null);

    useEffect(() => {
        setClub(selectedClub);
    }, [selectedClub]);

    const changeClubInformation = async () => {
        if (!club)
            {
                toast.error('Klubben eksisterer ikke');
                return;
            };

        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/' + club._id;

        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(club),
          });
          const data = await response.json();
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Et problem oppstod. Prøv igjen senere.');
          }
        }
      };

      return (
        <div className='flex w-auto bg-gray-200 rounded-xl shadow text-black overflow-y-auto'>
            {club ? (
                <div className='flex flex-col gap-2 p-4 text-black'>
                    <div className='flex flex-col'>
                        <strong>Endre klubbnavn</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.name}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre addresse</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.address}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre postnummer</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.zipCode}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre nettside</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.websiteURL}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre e-post</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.email}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre telefonnummer</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={club.phone}
                            onChange={(e) => setClub({ ...club, name: e.target.value })}
                        />
                    </div>

                    <button
                        className='bg-gray-600 text-white rounded hover:bg-green-600 mt-2'
                        onClick={() => changeClubInformation()}
                    >
                        Lagre klubbinformasjon
                    </button>
                </div>
            ) : null}

            <ToastContainer />
        </div>
      );
    };

    export default ClubSettings;
