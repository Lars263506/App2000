/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

/**
 * @author Lars Andreas Strand
 * @description This component manages invitations for a club. It allows club owners to:
 * - View a list of invitations.
 * - Add, edit, or delete invitations.
 * - Download invitations as PDF files.
 * The component also checks if the user is the owner of the selected club.
 */

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

import Invitation from '../../types/invitation';
import Club from '../../types/club';

import { useTranslation } from 'react-i18next';

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/invitations/`;

const Invitations: React.FC = () => {
  const { t } = useTranslation();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isClubOwner, setIsClubOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | null>(null);

  /**
   * Fetches invitations from the backend and updates the state.
   * Displays an error toast if the fetch fails.
   */
  useEffect(() => {
    const fetchInvitations = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      try {
        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status !== 200) throw new Error(t('invitations_error_fetch_invitations'));
        const data: Invitation[] = await response.json();
        setInvitations(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(t('invitations_toast_error_fetch_invitations'));
        }
      }
    };

    setSelectedClub(JSON.parse(localStorage.getItem('selectedClub') || ''));
    fetchInvitations();
  }, []);

  /**
   * Checks if the current user is the owner of the selected club.
   * Updates the `isClubOwner` state accordingly.
   */
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
            },
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
            toast.error(t('invitations_toast_error_check_owner'));
            setIsClubOwner(false);
          }
        }
      };
      checkClubOwner();
    }
  }, [selectedClub]);

  /**
   * Downloads an invitation as a PDF file.
   * @param invitation The invitation to download.
   */
  const handleDownloadPDF = (invitation: Invitation) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(invitation.title, 10, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(invitation.description, 10, 20);

    const textYPosition = 30;
    const maxWidth = 180;
    doc.text(invitation.text, 10, textYPosition, { maxWidth });

    doc.save(`${invitation.title}.pdf`);
  };

  /**
   * Opens the modal to add a new invitation.
   */
  const handleAddInvitation = () => {
    const maxId = invitations && invitations.length > 0
      ? Math.max(...invitations.map((inv) => inv.id))
      : 0;
    setCurrentInvitation({ id: maxId + 1, title: '', description: '', text: '' });
    setShowModal(true);
  };

  /**
   * Opens the modal to edit an existing invitation.
   * @param invitation The invitation to edit.
   */
  const handleEditInvitation = (invitation: Invitation) => {
    setCurrentInvitation(invitation);
    setShowModal(true);
  };

  /**
   * Deletes an invitation from the backend and updates the state.
   * @param id The ID of the invitation to delete.
   */
  const handleDeleteInvitation = async (id: number) => {
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
          invitationId: id,
          clubId: selectedClub?._id || 0,
        }),
      });
      if (response.status !== 200) throw new Error(t('invitations_error_delete_invitation'));
      setInvitations((prev) => prev.filter((invitation) => invitation.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('invitations_toast_error_delete_invitation'));
      }
    }
  };

  /**
   * Saves the current invitation (either creates or updates it).
   */
  const handleSaveInvitation = async () => {
    if (currentInvitation) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const existingInvitation = invitations.find((invitation) => invitation.id === currentInvitation.id);

        if (!existingInvitation) {
          const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(currentInvitation),
          });
          if (response.status !== 201) throw new Error(t('invitations_error_create_invitation'));
          setInvitations((prev) => [...prev, currentInvitation]);
        } else {
          const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              invitationId: currentInvitation.id,
              clubId: selectedClub?._id || 0,
              request: currentInvitation,
            }),
          });
          if (response.status !== 200) throw new Error(t('invitations_error_update_invitation'));
          setInvitations((prev) =>
            prev.map((invitation) =>
              invitation.id === currentInvitation.id ? currentInvitation : invitation
            )
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Det oppstod en feil med å lagre møteinnkallingen.');
        }
      }
    }
    setShowModal(false);
    setCurrentInvitation(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {isClubOwner && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAddInvitation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('invitations_add_invitation')}
          </button>
        </div>
      )}

      {invitations && invitations.length > 0 ? (
        invitations.map((invitation) => (
          <div key={invitation.id} className="p-4 border rounded-lg shadow-md bg-[#E7EFFB]">
            <h3 className="text-lg font-bold">{invitation.title}</h3>
            <p className="text-sm text-black">{invitation.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDownloadPDF(invitation)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t('invitations_download_pdf')}
              </button>
              {isClubOwner && (
                <>
                  <button
                    onClick={() => handleEditInvitation(invitation)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {t('invitations_edit_invitation')}
                  </button>
                  <button
                    onClick={() => handleDeleteInvitation(invitation.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {t('invitations_delete_invitation')}
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">{t('invitations_no_invitations_found')}</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {t('invitations_all_fields_required')}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('invitations_title')}</label>
              <input
                type="text"
                value={currentInvitation?.title || ''}
                onChange={(e) =>
                  setCurrentInvitation((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('invitations_description')}</label>
              <textarea
                value={currentInvitation?.description || ''}
                onChange={(e) =>
                  setCurrentInvitation((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('invitations_text')}</label>
              <textarea
                value={currentInvitation?.text || ''}
                onChange={(e) =>
                  setCurrentInvitation((prev) =>
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
                {t('invitations_cancel')}
              </button>
              <button
                onClick={handleSaveInvitation}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('invitations_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitations;
