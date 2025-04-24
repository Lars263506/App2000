/**
 * @description Translated by Ibrahim Queeum using i18next.
 */
import React, { useState } from 'react';
import Invitations from './Invitations'
import Minutes from './Minutes'
import { useTranslation } from 'react-i18next';

/**
 * @author Lars Andreas
 * @description The Meetings component provides a tabbed interface for managing club meetings.
 * Users can switch between two tabs: Invitations and Minutes. Each tab displays relevant content 
 * for meeting invitations and meeting minutes, respectively.
 * 
 * Features:
 * - Displays a tabbed interface for managing meetings.
 * - Allows users to switch between "Invitations" and "Minutes" tabs.
 * - Dynamically renders content for each tab.
 * - Uses i18next for localization support.
 */
const Meetings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'invitations' | 'minutes'>('invitations');

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full h-full max-h-100 overflow-y-auto">
      <h2 className="text-xl font-bold mb-2 text-black">{t('meetings_meetings')}</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'invitations' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('invitations')}
        >
          {t('meetings_invitations')}
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'minutes' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('minutes')}
        >
          {t('meetings_minutes')}
        </button>
      </div>

      {/* Tab Content */}
      
      <div>
        {activeTab === 'invitations' && (
          <div aria-label="Møteinnkallinger" className="flex flex-col gap-4">
            <Invitations />
          </div>
        )}
        {activeTab === 'minutes' && (
          <div aria-label="Møtereferater" className="flex flex-col gap-4">
            <Minutes />
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
