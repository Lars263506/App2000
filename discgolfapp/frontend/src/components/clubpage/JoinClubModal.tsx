/**
 * @description Translated by Ibrahim Queeum using i18next.
 */
import Modal from "../global/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const JoinClubModal: React.FC<{ clubId: string; onClose: () => void }> = ({ clubId, onClose }) => {
  const { t } = useTranslation();
    const [reason, setReason] = useState('');

    const handleSubmit = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/join/${clubId}`;
        const accessToken = localStorage.getItem('accessToken');

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reason }),
        });

        if (response.status === 200) {
          toast.success(t('joinclubmodal_join_request_sent'));
          onClose();
          window.location.reload();
        } else {
          toast.error(t('joinclubmodal_error'));
        }
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message || t('joinclubmodal_error'));
      }
    };

    return (
      <Modal onClose={onClose}>
        <h2 className="text-xl font-bold mb-4">{t('joinclubmodal_become_a_member')}</h2>
        <div className="mb-4">
          <label className="block mb-2">{t('joinclubmodal_why_join')}</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {t('joinclubmodal_send_request')}
        </button>
      </Modal>
    );
  };

export default JoinClubModal;
