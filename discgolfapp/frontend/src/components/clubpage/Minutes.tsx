import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

import Minute from '../../types/minute';
import Club from '../../types/club';

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/minutes/`;

const Minutes: React.FC = () => {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isClubOwner, setIsClubOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMinute, setCurrentMinute] = useState<Minute | null>(null);

  useEffect(() => {
    const fetchMinutes = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      try {
        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status !== 200) throw new Error('Failed to fetch minutes');
        const data: Minute[] = await response.json();
        setMinutes(data);
      } catch (error) {
        console.error(error);
      }
    };

    setSelectedClub(JSON.parse(localStorage.getItem('selectedClub') || ''));
    fetchMinutes();
  }, []);

  useEffect(() => {
    if (selectedClub) {
      const checkClubOwner = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || !selectedClub) return;
        try {
          const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/is-owner/${selectedClub._id}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            }
          });
          if (response.status === 200) {
            const { isOwner } = await response.json();
            setIsClubOwner(isOwner);
          } else {
            setIsClubOwner(false);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Det oppstod en feil med å sjekke klubbens eierskap.');
            setIsClubOwner(false);
          }
        }
      };
      checkClubOwner();
    }
  }, [selectedClub]);

  const handleDownloadPDF = (minute: Minute) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(minute.title, 10, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(minute.description, 10, 20);

    const textYPosition = 30;
    const maxWidth = 180;
    doc.text(minute.text, 10, textYPosition, { maxWidth });

    doc.save(`${minute.title}.pdf`);
  };

  const handleAddMinute = () => {
    const maxId = minutes && minutes.length > 0
      ? Math.max(...minutes.map((inv) => inv.id))
      : 0;
    setCurrentMinute({ id: maxId + 1, title: '', description: '', text: '' });
    setShowModal(true);
  };

  const handleEditMinute = (minute: Minute) => {
    setCurrentMinute(minute);
    setShowModal(true);
  };

  const handleDeleteMinute = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const response = await fetch(backendUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          minuteId: id,
          clubId: selectedClub?._id || 0
        }),
      });
      if (response.status !== 200) throw new Error('Failed to delete minute');
      setMinutes((prev) => prev.filter((meeting) => meeting.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveMinute = async () => {
    if (currentMinute) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const existingMinute = minutes.find((minute) => minute.id === currentMinute.id);

        if (!existingMinute) {
          const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(currentMinute),
          });
          if (response.status !== 201) throw new Error('Failed to create minute');
          setMinutes((prev) => [...prev, currentMinute]);
        } else {
          const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              minuteId: currentMinute.id,
              clubId: selectedClub?._id || 0,
              request: currentMinute,
            }),
          });
          if (response.status !== 200) throw new Error('Failed to update minute');
          setMinutes((prev) =>
            prev.map((minute) =>
              minute.id === currentMinute.id ? currentMinute : minute
            )
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Det oppstod en feil med å lagre møtereferatet.');
        }
      }
    }
    setShowModal(false);
    setCurrentMinute(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {isClubOwner && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAddMinute}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Legg til møtereferat
          </button>
        </div>
      )}

      {minutes && minutes.length > 0 ? (
        minutes.map((minute) => (
          <div key={minute.id} className="p-4 border rounded-lg shadow-md bg-[#E7EFFB]">
            <h3 className="text-lg font-bold">{minute.title}</h3>
            <p className="text-sm text-black">{minute.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDownloadPDF(minute)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Last ned som PDF
              </button>
              {isClubOwner && (
                <>
                  <button
                    onClick={() => handleEditMinute(minute)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Rediger
                  </button>
                  <button
                    onClick={() => handleDeleteMinute(minute.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Slett
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ingen møtereferater funnet.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Alle felter er påkrevd</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tittel</label>
              <input
                type="text"
                value={currentMinute?.title || ''}
                onChange={(e) =>
                  setCurrentMinute((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Beskrivelse</label>
              <textarea
                value={currentMinute?.description || ''}
                onChange={(e) =>
                  setCurrentMinute((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tekst</label>
              <textarea
                value={currentMinute?.text || ''}
                onChange={(e) =>
                  setCurrentMinute((prev) =>
                    prev ? { ...prev, text: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveMinute}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lagre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minutes;
