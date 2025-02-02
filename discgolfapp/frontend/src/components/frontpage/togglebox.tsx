import React, { useState } from 'react';

interface ToggleBoxProps {
    children: React.ReactNode;
}

const ToggleBox: React.FC<ToggleBoxProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full mx-auto mt-4 p-4">
            <div className={`relative bg-white border border-gray-300 rounded shadow-md ${isOpen ? 'h-auto' : 'h-20'} overflow-hidden transition-all duration-300`}>
                <button onClick={toggle} className="absolute left-0 top-0 mt-2 ml-2 bg-gray-200 rounded-full p-2">
                    <svg className={`w-6 h-6 transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                <div className={`p-4 ${isOpen ? 'block' : 'hidden'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default ToggleBox;