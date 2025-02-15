import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
    togglePopup: () => void;
    toggleRegisterPopup: () => void;
    closePopup: () => void;
}

type LoginResponseData = {
    displayName: string;
    accessToken: string;
    refreshToken: string;
    message?: string;
};

const Login: React.FC<LoginProps> = ({ togglePopup, toggleRegisterPopup, closePopup }) => {
    const [locked, setLocked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        if (locked) return;

        setLocked(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/login/';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data: LoginResponseData = await response.json();
            if (response.status !== 200) {
                toast.error(data.message);
            } else {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setIsLoggedIn(true);
                toast.success('Logget inn med bruker: ' + data.displayName, {
                    onClose: () => {
                        closePopup();
                        window.location.reload();
                    },
                });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Et problem oppstod. Vennligst prøv igjen senere.");
            }
        } finally {
            setLocked(false);
            setEmail('');
            setPassword('');
        }
    };

    const handleLogout = async () => {
       
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.success("Du er logget ut.");
        window.location.reload();
    
        setIsLoggedIn(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-black mb-8">
                    {isLoggedIn ? 'Logget inn' : 'Logg inn'}
                </h2>
                {isLoggedIn ? (
                    <button
                        type="button"
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 mb-4"
                        onClick={handleLogout}
                    >
                        Logg ut
                    </button>
                ) : (
                    <form className="flex flex-col" onSubmit={handleLogin}>
                        <button
                            type="button"
                            className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-2"
                        >
                            Logg inn med GitHub
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
                        >
                            Logg inn med Google
                        </button>

                        <h2 className="text-center text-black mb-2">Innlogging:</h2>
                        <div className="flex flex-col mb-2 text-black">
                            <input
                                type="email"
                                className="border p-2 rounded"
                                placeholder="Skriv inn e-post"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mb-6 text-black">
                            <input
                                type="password"
                                className="border p-2 rounded"
                                placeholder="Skriv inn passord"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <a href="/glemt-passord" className="text-black hover:underline mt-2 text-sm text-center">
                                Glemt passord?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
                        >
                            Logg inn
                        </button>

                        <h2 className="text-center text-black mt-8">Har du ikke bruker?</h2>
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-2"
                            onClick={() => {
                                togglePopup();
                                toggleRegisterPopup();
                            }}
                        >
                            Registrer deg
                        </button>
                    </form>
                )}

                <div className="flex justify-start mt-auto">
                    <button
                        type="button"
                        className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 mt-4"
                        onClick={closePopup}
                    >
                        Lukk
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;
