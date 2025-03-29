import React from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { Club } from '../../types/club'
import SelectButton from './selectButton'

interface ClubDetailsProps {
  selectedClub: Club | null;
  setSelectedClub: (club: Club) => void;
}

const ClubSettings: React.FC<ClubDetailsProps> = ({ selectedClub, setSelectedClub }) => {

    const changeClubInformation = async () => {
        if (!selectedClub)
            {
                toast.error('Klubben eksisterer ikke');
                return;
            };

        const accessToken = localStorage.getItem('accessToken')
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/' + selectedClub._id;

        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedClub),
          });
          if (response.status === 200) {
            toast.success('Klubbinformasjonen ble endret!');
          }
          else {
            toast.error('Klubbinformasjonen ble ikke endret. Prøv igjen senere.');
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Et problem oppstod. Prøv igjen senere.');
          }
        }
      };

      return (
        <div className='flex w-auto shadow text-black overflow-y-auto'>
            {selectedClub ? (
                <div className='flex flex-col gap-2 p-4 text-black'>
                    <div className='flex flex-col'>
                        <strong>Endre klubbnavn</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.name}
                            onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre addresse</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.address}
                            onChange={(e) => setSelectedClub({ ...selectedClub, address: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre postnummer</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.zipCode}
                            onChange={(e) => setSelectedClub({ ...selectedClub, zipCode: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre nettside</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.websiteURL}
                            onChange={(e) => setSelectedClub({ ...selectedClub, websiteURL: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre e-post</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.email}
                            onChange={(e) => setSelectedClub({ ...selectedClub, email: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <strong>Endre telefonnummer</strong>
                        <input
                            type='text'
                            className='border p-2 rounded'
                            value={selectedClub.phone}
                            onChange={(e) => setSelectedClub({ ...selectedClub, phone: e.target.value })}
                        />
                    </div>

                    <SelectButton
                        onClick={() => changeClubInformation()}
                    >
                        Lagre klubbinformasjon
                    </SelectButton>
                </div>
            ) : (
                <header>Ingen klubb valgt.</header>
            )}

            <ToastContainer />
        </div>
      );
    };

    export default ClubSettings;
