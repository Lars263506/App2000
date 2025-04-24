import React from 'react'
import { toast, ToastContainer } from 'react-toastify'

import Club from '../../types/club'
import SelectButton from './SelectButton'

import { useTranslation } from 'react-i18next'

interface ClubDetailsProps {
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
}

const ClubSettings: React.FC<ClubDetailsProps> = ({ selectedClub, setSelectedClub }) => {
    const { t } = useTranslation()
    const changeClubInformation = async () => {
      if (!selectedClub) {
        toast.error('Klubben eksisterer ikke');
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/' + selectedClub._id;

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedClub),
        });
        if (response.status === 200) {
          toast.success(t('clubsettings_toast_success_club_information_changed'));
        } else {
          toast.error(t('clubsettings_toast_error_club_information_changed'));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(t('clubsettings_toast_error_club_information_changed'));
        }
      }
    };

    const deleteClub = async (clubId: string) => {
      if (!clubId) {
        toast.error('Klubb-ID mangler');
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/' + clubId;

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        });

        if (response.status === 200) {
          toast.success(t('clubsettings_toast_success_club_deleted'));
          setSelectedClub(null);
        } else {
          toast.error(t('clubsettings_toast_error_club_deleted'));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(t('clubsettings_toast_error_club_deleted'));
        }
      }
    };

    return (
      <div className="flex w-auto shadow text-black overflow-y-auto">
        {selectedClub ? (
          <div className="flex flex-col gap-2 p-4 text-black">
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_club_name')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.name}
                onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_address')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.address}
                onChange={(e) => setSelectedClub({ ...selectedClub, address: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_post_code')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.zipCode}
                onChange={(e) => setSelectedClub({ ...selectedClub, zipCode: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_webpage')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.websiteURL}
                onChange={(e) => setSelectedClub({ ...selectedClub, websiteURL: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_email')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.email}
                onChange={(e) => setSelectedClub({ ...selectedClub, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <strong>{t('clubsettings_change_phone')}</strong>
              <input
                type="text"
                className="border p-2 rounded"
                value={selectedClub.phone}
                onChange={(e) => setSelectedClub({ ...selectedClub, phone: e.target.value })}
              />
            </div>

            <SelectButton onClick={() => changeClubInformation()}>
              {t('clubsettings_save_club_information')}
            </SelectButton>

            <SelectButton onClick={() => deleteClub(selectedClub._id)}>
            {t('clubsettings_delete_club')}
            </SelectButton>

            <SelectButton onClick={() => setSelectedClub(null)}>
            {t('clubsettings_back_to_club_list')}
            </SelectButton>
          </div>
        ) : (
          <header>{t('clubsettings_no_club_selected')}</header>
        )}

        <ToastContainer />
      </div>
    );
  };

  export default ClubSettings;
