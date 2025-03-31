import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ClubAdminDetails from './clubadmindetails'
import CourseAdminDetails from './courseadmindetails'
import UserAdminDetails from './useradmindetails'
import { Setting } from '../../types/setting';
import SelectButton from '../global/selectButton'
import GetStartedAdminDetails from './GetStartedAdminDetails'

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<Setting[] | null>();
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
    const settingComponents: { [key: string]: React.FC } = {
        'Klubbadministrasjon': ClubAdminDetails,
        "Baneadministarjon": CourseAdminDetails,
        'Brukeradministrasjon': UserAdminDetails,
        'Kom i gang': GetStartedAdminDetails,
        'Oversettelser': () => <header>Oversettelser</header>,
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken')
                const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/settings/'

                const response = await fetch(url, {
                    method: 'GET',
                    headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : undefined
                })

                const data: Setting[] = await response.json()

                if (Array.isArray(data)) {
                    setSettings(data)
                } else {
                    toast.error('Responsen fra serveren var ikke en liste med innstillinger.')
                }

            } catch (error: unknown) {
              if (error instanceof Error) toast.error(error.message)
                else toast.error('Det var en feil med å hente innstillingene. Prøv igjen senere.')
            }
          }
        fetchSettings()
    }, [])

    return (
        <div className="flex flex-row gap-4 p-4 rounded-md min-h-[80vh] bg-white">

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
