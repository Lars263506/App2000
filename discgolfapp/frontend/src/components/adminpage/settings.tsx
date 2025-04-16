import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ClubAdminDetails from './ClubAdminDetails'
import CourseAdminDetails from './CourseAdminDetails'
import UserAdminDetails from './UserAdminDetails'
import CourseSettings from './CourseSettings'
import Setting  from '../../types/setting';
import SelectButton from '../global/SelectButton'

interface SettingsProps {
    setSelectedPage: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ setSelectedPage }) => {
    const [settings, setSettings] = useState<Setting[] | null>();
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
    const [isClubOwner, setIsClubOwner] = useState(false);

    const settingComponents: { [key: string]: React.FC } = {
        'Klubbadministrasjon': () => <ClubAdminDetails setSelectedPage={setSelectedPage} />,
        "Baneadministarjon": CourseAdminDetails,
        'Brukeradministrasjon': UserAdminDetails,
        'Oversettelser': () => <header>Oversettelser</header>,
        'Banetegningadministrasjon': CourseSettings,
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/settings/';

                const response = await fetch(url, {
                    method: 'GET',
                    headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : undefined,
                });

                const data: Setting[] = await response.json();

                if (Array.isArray(data)) {
                    setSettings(data);
                } else {
                    toast.error('Responsen fra serveren var ikke en liste med innstillinger.');
                }

            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error('Det var en feil med å hente innstillingene. Prøv igjen senere.');
            }
        };
        fetchSettings();
    }, []);

    if (isClubOwner) {
        return (
            <div className="flex flex-col w-full p-4 rounded-md min-h-[100vh] bg-white">
                <CourseAdminDetails />
            </div>
        );
    }

    return (
        <div className="flex flex-row gap-4 p-4 rounded-md min-h-[100vh] bg-white">

            {/* Settings list */}
            <div className="flex flex-col w-1/5 p-2 rounded-md bg-[#E7EFFB] overflow-y-auto">
                {settings && settings.length > 0 ? (
                    settings.map((setting, index) => (
                        <SelectButton key={index} onClick={() => setSelectedSetting(setting)}
                            >
                            {setting.name}
                        </SelectButton>
                    ))
                ) : (
                    <header>Ingen innstillinger å vise.</header>
                )}
            </div>

            {/* Setting component */}
            <div className="flex flex-col w-4/5 p-2 rounded-md bg-[#E7EFFB]">
                {selectedSetting ? (
                    React.createElement(settingComponents[selectedSetting.name])
                ) : (
                    <header>Velg en innstilling fra listen til venstre.</header>
                )}
            </div>
        </div>
    )
  }

  export default Settings;
