import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css';

interface RegisterProps {
    togglePopup: () => void;
}

const Register: React.FC<RegisterProps> = ({ togglePopup }) => {
    const [locked, setLocked] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        if (locked) return;

        setLocked(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/';

        event.preventDefault();
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName,
                    email,
                    password,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status !== 201) {
                toast.error(data.message);
            } else {
                toast.success('Brukeren ble opprettet!');
            }
        } catch (error: Error | any) {
            toast.error(error.message);
        } finally {
            setLocked(false);
            setDisplayName('');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-12 text-center text-black">Registrer deg</h2>
                <h2 className="font-bold mb-2 text-left text-black">Lag bruker i disse feltene:</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex flex-col mb-3">
                        <input
                            type="text"
                            className="border p-2 rounded"
                            placeholder="Skriv inn et kallenavn"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <input
                            type="email"
                            className="border p-2 rounded"
                            placeholder="Skriv inn e-post"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="password"
                            className="border p-2 rounded"
                            placeholder="Velg et passord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2"
                    >
                        Registrer
                    </button>
                    <button
                        type="button"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mt-12"
                        onClick={togglePopup}
                    >
                        Tilbake til logg inn
                    </button>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
};

export default Register;