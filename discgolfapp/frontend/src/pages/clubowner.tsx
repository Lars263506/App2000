'use client';

import Navbar from '@/components/navbar';
import { useState } from 'react';
import 'react-resizable/css/styles.css';
import '../app/globals.css';
import Toolbox from '@/components/clubpage/toolbox';

type ElementType = {
    type: string;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    classname: string;
};

export default function ToolboxPage() {
    const [elements, setElements] = useState<ElementType[]>([]);

    const handleElementDropped = (id: string, x: number, y: number) => {
        setElements((prevElements) => [
            ...prevElements,
            { type: id, id: Date.now(), x, y, width: 100, height: 100, content: "", classname: "" },
        ]);
    };

    return (
        <div className="flex flex-col h-screen">
        <Navbar toggleLoginPopup={() => { }} />
        <div className="flex flex-1 border border-gray-300">
            <Toolbox/>
        </div>
    </div>
    );
}
