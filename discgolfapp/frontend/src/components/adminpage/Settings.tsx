import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ClubAdminDetails from './ClubAdminDetails'
import UserAdminDetails from './UserAdminDetails'
import CourseSettings from './CourseSettings'
import CreateCourse from './CreateCourse'
import Setting from '../../types/setting';
import SelectButton from '../global/SelectButton'

import { useTranslation } from 'react-i18next'

interface SettingsProps {
    setSelectedPage: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ setSelectedPage }) => {
    const { t } = useTranslation()
    const [settings, setSettings] = useState<Setting[] | null>();
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

    const settingComponents: { [key: string]: React.ReactNode } = {
        'Klubbadministrasjon': <ClubAdminDetails setSelectedPage={setSelectedPage} />,
        'Brukeradministrasjon': <UserAdminDetails />,
        'Oversettelser': <header>Oversettelser</header>,
        'Banetegningadministrasjon': <CourseSettings />,
        'Baneadministrasjon': <CreateCourse />,
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
                    toast.error(t('settings_toast_error_not_array'));
                }

            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error(t('settings_toast_error_unknown'));
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="flex flex-row gap-4 p-4 rounded-md min-h-[100vh] bg-white">

            {/* Settings list */}
            <div className="flex flex-col w-1/5 p-2 rounded-md bg-[#E7EFFB] overflow-y-auto">
                {settings && settings.length > 0 ? (
                    settings.map((setting, index) => (
                        <SelectButton key={index} onClick={() => setSelectedSetting(setting)}>
                            {setting.name}
                        </SelectButton>
                    ))
                ) : (
                    <header>{t("settings_no_settings")}</header>
                )}
            </div>

            {/* Setting component */}
            <div className="flex flex-col w-4/5 p-2 rounded-md bg-[#E7EFFB]">
                {selectedSetting ? (
                    settingComponents[selectedSetting.name]
                ) : (
                    <header>{t("settings_prompt")}</header>
                )}
            </div>
        </div>
    )
  }

  export default Settings;
