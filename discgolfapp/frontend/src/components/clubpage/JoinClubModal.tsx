import Modal from "../global/Modal";
import { useState } from "react";
import { toast } from "react-toastify";

const JoinClubModal: React.FC<{ clubId: string; onClose: () => void }> = ({ clubId, onClose }) => {
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
          toast.success('Søknaden din er sendt!');
          onClose();
          window.location.reload();
        } else {
          toast.error('Noe gikk galt. Prøv igjen senere.');
        }
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message || 'Noe gikk galt. Prøv igjen senere.');
      }
    };

    return (
      <Modal onClose={onClose}>
        <h2 className="mb-4 text-xl font-bold">Bli medlem</h2>
        <div className="mb-4">
          <label className="block mb-2">Hvorfor vil du bli medlem? (valgfritt)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Send inn
        </button>
      </Modal>
    );
  };

export default JoinClubModal;
