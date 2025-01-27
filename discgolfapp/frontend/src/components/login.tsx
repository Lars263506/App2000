import React from 'react';
import '../app/globals.css';

interface LoginProps {
    togglePopup: () => void;
    toggleRegisterPopup: () => void;
    closePopup: () => void;
}

const Login: React.FC<LoginProps> = ({ togglePopup, toggleRegisterPopup, closePopup }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-black mb-8">Logg inn</h2>
                <form className="flex flex-col">
                    <button
                        type="button"
                        className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-900 mb-2"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.4 3-.405 1.02.005 2.043.14 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.217.694.825.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Logg inn med GitHub
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 mb-10"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.35 11.1h-9.36v2.82h5.44c-.24 1.32-.96 2.44-2.04 3.18v2.64h3.3c1.92-1.74 3.06-4.32 3.06-7.38 0-.66-.06-1.32-.18-1.98zM12 22.2c2.64 0 4.86-.9 6.48-2.4l-3.3-2.64c-.9.6-2.04.96-3.18.96-2.46 0-4.56-1.62-5.28-3.84H3.36v2.64c1.62 3.24 4.92 5.28 8.64 5.28zM6.72 13.2c-.18-.6-.3-1.26-.3-1.92s.12-1.32.3-1.92V6.72H3.36C2.64 8.04 2.28 9.48 2.28 11.1s.36 3.06 1.08 4.38l3.36-2.28zM12 4.8c1.44 0 2.76.48 3.78 1.44l2.82-2.82C16.86 1.92 14.64 1.2 12 1.2 7.92 1.2 4.62 3.24 3 6.48l3.36 2.28c.72-2.22 2.82-3.96 5.28-3.96z" />
                        </svg>
                        Logg inn med Google
                    </button>
                    <h2 className="font-bold text-left text-black mb-2">Manuell innlogging:</h2>
                    <div className="flex flex-col mb-2 text-black">
                        <input
                            type="email"
                            className="border p-2 rounded"
                            placeholder="Skriv inn e-post"
                        />
                    </div>
                    <div className="flex flex-col mb-6 text-black">
                        <input
                            type="password"
                            className="border p-2 rounded"
                            placeholder="Skriv inn passord"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
                    >
                        Logg inn
                    </button>
                    <h2 className="font-bold text-left text-black mt-8">Har du ikke bruker? Trykk her:</h2>
                    <button
                        type="button"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2"
                        onClick={() => {
                            togglePopup();
                            toggleRegisterPopup();
                        }}
                    >
                        Registrer deg
                    </button>
                    <div className="flex justify-start mt-auto">
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-600 mt-16"
                            onClick={closePopup}
                        >
                            Lukk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;