import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import NavBar from '../components/global/navbar';
import Footer from '../components/global/footer';
import ClubAdminDetails from '@/components/adminpage/clubadmindetails';
import UserAdminDetails from '@/components/adminpage/useradmindetails';
import { usePopup } from '@/components/global/usepopup'
import PopupWrapper from '@/components/global/popupwrapper'

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
*/

interface Setting {
    name: string,
    description: string
}

const AdminPage: React.FC = () => {
    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup, toggleMyPagePopup } = usePopup()
    const [settings, setSettings] = useState<Setting[] | null>();
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
    const settingComponents: { [key: string]: React.FC } = {
        'Klubbadministrasjon': ClubAdminDetails,
        'Brukeradministrasjon': UserAdminDetails
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
        <div className="admin-page">
            <NavBar toggleLoginPopup={toggleLoginPopup}/>

            <div className="flex flex-row justify-center h-[80vh] bg-white">
                <div className="w-fit rounded-lg p-4 m-4 mr-0 bg-gray-600">
                    <ul>
                        {settings &&
                            settings.map(setting => (
                            <li
                                className="cursor-pointer hover:bg-green-600"
                                key={setting.name}
                                onClick={() => setSelectedSetting(setting)}>
                                {setting.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-auto rounded-lg p-4 m-4 bg-gray-600">
                    {selectedSetting ? (
                        <div className="h-full">
                            {settingComponents[selectedSetting.name] &&
                                React.createElement(
                                    settingComponents[selectedSetting.name]
                                )}
                        </div>
                    ) : (
                        <p>Velg en innstilling i menyen til venstre for å se alternativer.</p>
                    )}
                </div>
            </div>

            <PopupWrapper
                popupType={popupType}
                closePopup={closePopup}
                toggleRegisterPopup={toggleRegisterPopup}
                toggleMyPagePopup={toggleMyPagePopup}
            />

            <Footer />

            <ToastContainer />
        </div>
    );
};

export default AdminPage;
