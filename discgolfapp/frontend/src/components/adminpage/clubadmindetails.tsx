import { useState } from 'react';

import { Club } from '../../types/club';
import ClubList from '../global/clublist';
import ClubSettings from '../global/clubsettings';
import CreateNewClub from './CreateNewClub';

const ClubAdminDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedAction, setSelectedAction] = useState<'create' | 'update' | null>(null);

  return (
    <div className="flex flex-col h-full justify-center gap-4">
      {/* Render SelectButtons if no action is selected */}
      {!selectedAction && (
        <div className="flex flex-row justify-center gap-4">
          <button
            className="p-4 bg-black text-white rounded shadow hover:bg-blue-600"
            onClick={() => setSelectedAction('create')}
          >
            Create New Club
          </button>
          <button
            className="p-4 bg-black text-white rounded shadow hover:bg-green-600"
            onClick={() => setSelectedAction('update')}
          >
            Update Existing Club
          </button>
        </div>
      )}

      {/* Render CreateNewClub if "Create New Club" is selected */}
      {selectedAction === 'create' && (
        <CreateNewClub onClose={() => setSelectedAction(null)} />
      )}

      {/* Render ClubList and ClubSettings if "Update Existing Club" is selected */}
      {selectedAction === 'update' && (
        <div className="flex flex-row h-full gap-4">
          <div className="w-5/10 rounded-md bg-white border border-solid border-black">
            <ClubList
              selectedClub={selectedClub}
              setSelectedClub={setSelectedClub}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSelectedPage={() => {}}
            />
          </div>

          {selectedClub && (
            <div className="w-5/10 rounded-md bg-white border border-solid border-black overflow-y-auto">
              <ClubSettings
                selectedClub={selectedClub}
                setSelectedClub={setSelectedClub}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubAdminDetails;
