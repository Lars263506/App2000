'use client';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/router';
import { DragEvent, useState, useEffect } from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

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
    const router = useRouter();
    const [elements, setElements] = useState<ElementType[]>([]);
    const [selectedElement, setSelectedElement] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const addElement = (type: string, x: number, y: number) => {
        setElements([...elements, { type, id: elements.length, x, y, width: 100, height: 100, content: type.includes('text') ? 'Edit me' : '', classname: 'text-black' }]);
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, type: string) => {
        e.dataTransfer.setData('type', type);
        e.dataTransfer.setData('id', e.currentTarget.id);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addElement(type, x, y);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        const element = elements.find(el => el.id === id);
        if (element) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
    
            const middleAreaXStart = rect.width * 0.35;
            const middleAreaXEnd = rect.width * 0.65;
            const middleAreaYStart = rect.height * 0.35;
            const middleAreaYEnd = rect.height * 0.65;
    
            if (clickX >= middleAreaXStart && clickX <= middleAreaXEnd && clickY >= middleAreaYStart && clickY <= middleAreaYEnd) {
                setSelectedElement(id);
                setIsDragging(true);
                setDragOffset({ x: e.clientX - element.x, y: e.clientY - element.y });
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && selectedElement !== null) {
                const newElements = elements.map(element => {
                    if (element.id === selectedElement) {
                        return { ...element, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
                    }
                    return element;
                });
                setElements(newElements);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    });

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>, id: number) => {
        const newElements = elements.map(element => {
            if (element.id === id) {
                return { ...element, content: e.currentTarget.textContent || '' };
            }
            return element;
        });
        setElements(newElements);
    
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
            range.selectNodeContents(e.currentTarget);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const handleResizeStop = (e: React.SyntheticEvent, data: ResizeCallbackData, id: number) => {
        setElements((prevElements) =>
            prevElements.map((element) =>
                element.id === id
                    ? { ...element, width: data.size.width, height: data.size.height }
                    : element
            )
        );
    };

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const deleteElementsWithinRadius = (radius: number) => {
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            const rect = trashBin.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            setElements(elements.filter(element => {
                const distance = calculateDistance(centerX, centerY, element.x, element.y);
                return distance > radius;
            }));
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar toggleLoginPopup={() => {}} />
            <div className="flex flex-1 border border-gray-300">
                {/* Sidebar */}
                <div className="w-48 border-r border-gray-300 flex flex-col p-2 bg-gray-100">
                    <div className="text-center font-bold text-black mb-4">Verktøy-kasse</div>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <div className="text-center text-sm font-bold text-black mt-10">Figur</div>
                            <div className="flex space-x-2 justify-center mt-2">
                                <div
                                    id="box"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'box')}
                                    className="w-12 h-12 border border-gray-500 bg-gray-200 cursor-pointer flex items-center justify-center"
                                >
                                    <div className="w-full h-full bg-gray-300"></div>
                                </div>
                                <div
                                    id="circle"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'circle')}
                                    className="w-12 h-12 cursor-pointer flex items-center justify-center"
                                >
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-sm font-bold text-black mt-10">Text</div>
                            <div className="flex space-x-2 justify-center mt-2">
                                <div
                                    id="text1"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'text1')}
                                    className="p-2 border border-gray-500 bg-gray-200 cursor-pointer text-black"
                                >
                                    Calebri
                                </div>
                                <div
                                    id="text2"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'text2')}
                                    className="p-2 border border-gray-500 bg-gray-200 cursor-pointer text-black"
                                >
                                    Times new
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div
                    className="flex-1 flex flex-col p-10 bg-white border border-gray-300 relative"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        >
                        {elements.map((element) => (
                        <div
                        key={element.id}
                        id={element.id.toString()}
                        className={`absolute ${isDragging && selectedElement === element.id ? 'border border-blue-500' : ''}`}
                        style={{ left: element.x, top: element.y }}
                            >
                            {element.type === 'box' && (
                            <ResizableBox
                            width={element.width}
                            height={element.height}
                            minConstraints={[30, 30]}
                            maxConstraints={[1000, 1000]}
                            onResizeStop={(e, data) => handleResizeStop(e, data, element.id)}
                                >
                                <div
                                className="w-full h-full bg-gray-200 flex items-center justify-center"
                                onMouseDown={(e) => handleMouseDown(e, element.id)}
                                    >
                                    {element.content && (
                                    <div
                                    className="text-lg text-black"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => handleContentChange(e, element.id)}
                                    >
                                    {element.content}
                                    </div>
                                    )}
                                    </div>
                                    </ResizableBox>
                                    )}
                                    {element.type === 'circle' && (
                                        <ResizableBox
                                        width={element.width}
                                        height={element.height}
                                        minConstraints={[50, 50]}
                                        maxConstraints={[1000, 1000]}
                                        onResizeStop={(e, data) => handleResizeStop(e, data, element.id)}
                                            >
                                            <div
                                            className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center"
                                            onMouseDown={(e) => handleMouseDown(e, element.id)}
                                            >
                                            {element.content && (
                                            <div
                                            className="text-lg text-black"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => handleContentChange(e, element.id)}
                                            >
                                                {element.content}
                                                </div>
                                                )}
                                                </div>
                                                </ResizableBox>
                                                )}
                                                {element.type === 'text1' && (
                                                    <div
                                                        className="text-lg text-black"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onMouseDown={(e) => handleMouseDown(e, element.id)}
                                                        onInput={(e) => handleContentChange(e, element.id)}
                                                    >
                                                        {element.content}
                                                    </div>
                                                )}
                                                {element.type === 'text2' && (
                                                    <div
                                                        className="text-lg text-black"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onMouseDown={(e) => handleMouseDown(e, element.id)}
                                                        onInput={(e) => handleContentChange(e, element.id)}
                                                    >
                                                        {element.content}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                    <div
                        id="trash-bin"
                        className="absolute bottom-4 right-4 w-16 h-16 bg-black text-white flex items-center justify-center cursor-pointer"
                        onClick={() =>  deleteElementsWithinRadius(400)}
                    >
                        🗑️
                    </div>
                </div>
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-grey-500 text-black rounded"
                    >
                        Hjem
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}