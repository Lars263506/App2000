import { useRouter } from 'next/router';
import { FC } from 'react';

interface SecondBoxProps {
    toggleSecondBox: () => void;
    isSecondBoxOpen: boolean;
}

const SecondBox: FC<SecondBoxProps> = ({ toggleSecondBox, isSecondBoxOpen }) => {
    const router = useRouter();
    const navigateToToolbox = () => router.push('/clubowner');

    return (
        <div className="w-full mx-auto mt-4 p-4">
            <div className={`relative bg-white border border-gray-300 rounded shadow-md ${isSecondBoxOpen ? 'h-auto' : 'h-20'} overflow-hidden transition-all duration-300`}>
                <button onClick={toggleSecondBox} className="absolute left-0 top-0 mt-2 ml-2 bg-gray-200 rounded-full p-2">
                    <svg className={`w-6 h-6 transform ${isSecondBoxOpen ? 'rotate-90' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path> 
                    </svg> 
                </button> 
                <div className={`p-4 ${isSecondBoxOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer">
                            <h2 className="text-3xl font-bold text-black">Spill nå</h2>
                        </div>
                        <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer">
                            <h2 className="text-3xl font-bold text-black">Baner</h2>
                        </div>
                        <div className="bg-gray-100 p-4 rounded shadow w-96 h-72 flex items-center justify-center cursor-pointer" onClick={navigateToToolbox}>
                            <h2 className="text-3xl font-bold text-black">Klubber</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div> // copilot har hjulpet til med å lage koden som viser boksen og bildet, skrevet koden inn selv, men copilot har hjulpet. På linje 16-20
    );
};

export default SecondBox;