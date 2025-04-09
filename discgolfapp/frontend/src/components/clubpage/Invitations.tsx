import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface Invitation {
  id: number;
  title: string;
  description: string;
  text: string;
}

const Invitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      const mockData: Invitation[] = [
        { id: 1, title: 'Møte 1', description: 'Beskrivelse av møte 1', text: 'Detaljer om møte 1' },
        { id: 2, title: 'Møte 2', description: 'Beskrivelse av møte 2', text: 'Detaljer om møte 2' },
      ];
      setInvitations(mockData);
    };

    fetchInvitations();
  }, []);

  const handleDownloadPDF = (invitation: Invitation) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(invitation.title, 10, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(invitation.description, 10, 20);
    doc.text(invitation.text, 10, 30);
    doc.save(`${invitation.title}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-bold">{invitation.title}</h3>
          <p className="text-sm text-gray-700">{invitation.description}</p>
          <button
            onClick={() => handleDownloadPDF(invitation)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Last ned som PDF
          </button>
        </div>
      ))}
    </div>
  );
};

export default Invitations;
