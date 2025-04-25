import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ClubAdminDetails from './ClubAdminDetails'
import UserAdminDetails from './UserAdminDetails'
import CourseSettings from './CourseSettings'
import CreateCourse from './CreateCourse'
import Setting from '../../types/setting';
import SelectButton from '../global/SelectButton'

import { useTranslation } from 'react-i18next'

/**
 * Props for the Settings component
 * @typedef {Object} SettingsProps
 * @property {function(string): void} setSelectedPage - Function to set the selected page.
 * @author Lars Andreas Strand and Andreas Nilsen
 */

interface SettingsProps {
    setSelectedPage: (page: string) => void;
}

/**
 * Settings Component
 * Provides an interface for managing various settings, including club administration, user administration, translations, course drawing, and course management.
 * Dynamically loads the appropriate component based on the selected setting.
 * 
 * @author Lars Andreas Strand and Andreas Nilsen
 */

/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

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

     /**
         * Fetches settings from the backend and updates the state.
         * Displays an error toast if the fetch operation fails.
         * 
         * @function fetchSettings
         * @returns {Promise<void>}
         * @author Lars Andreas Strand
         */
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

    /**
     * Renders the list of settings and the selected setting's component.
     * Displays a prompt if no setting is selected.
     * 
     * @function Settings
     * @param {SettingsProps} props - Contains the setSelectedPage function.
     * @returns {JSX.Element}
     * @author Lars Andreas Strand
     */
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
