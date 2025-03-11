'use client'

import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import NavBar from '../components/global/navbar';
import Footer from '../components/global/footer';
import { usePopup } from '@/components/global/usepopup'
import PopupWrapper from '@/components/global/popupwrapper'

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
*/

interface Setting {
    name: string,
    description: string,
    isToggled?: boolean,
    value?: string
}

const AdminPage: React.FC = () => {
    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup, toggleMyPagePopup } = usePopup()
    const [settings, setSettings] = useState<Setting[] | null>();
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // const accessToken = localStorage.getItem('accessToken')
                // const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/settings/'
            
                // const response = await fetch(url, {
                //     method: 'GET',
                //     headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : undefined
                // })

                // const data = await response.json()

                const data: Setting[] = [
                    { name: 'Forsidebilde', description: 'Bilde som vises på forsiden.' },
                    { name: 'Klubbinformasjon', description: "Informasjonen for klubbene." },
                ];

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
            
            <div className="flex flex-row h-[80vh] bg-white">
                <div className="w-fit border border-solid border-black rounded-lg p-4 m-4 bg-gray-600">
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
                <div className="flex-grow border border-solid border-black rounded-lg p-4 m-4 bg-gray-600">
                    {selectedSetting ? (
                        <div>
                            <h2>{selectedSetting.name}</h2>
                            <p>{selectedSetting.description}</p>
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