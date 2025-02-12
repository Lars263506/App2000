import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';

import Image from 'next/image'; 
import '../../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Announcement from "./announcements";
import FieldInformation from "./fieldinformation";
import MemberList from "./memberlist";

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This component is the toolbox for the club page. It contains the different components that can be added to the club page.
 * @disclaimer Much of the code in this file is inspired by ChatGPT and Copilot.
 */

type Elements = {
    nonmemberElements: Component[];
    memberElements: Component[];
};

type ToolboxProps = {
    clubId: string | undefined;
    view: "nonmember" | "member" | "clubowner";
};

type Component = {
    type: string;
    uniqueId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    _id?: string;
};

const Toolbox: React.FC<ToolboxProps> = ({ clubId, view }) => {
    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [isToolboxOpen, setIsToolboxOpen] = useState(true);
    const [currentView, setCurrentView] = useState(view);
    
    const dropZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchElements = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: accessToken ? { 'Authorization': 'Bearer ' + accessToken } : {},
                });

                const data: Elements = await response.json();

                if (data.nonmemberElements) {
                    setComponents(data.nonmemberElements);
                } else if (data.memberElements) {
                    setComponents(data.memberElements);
                }

            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
            }
        };
        if (id) 
            fetchElements();
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [id]);

    const handleMouseDown = (e: React.MouseEvent, component: Component) => {
        
        e.stopPropagation();

        component = {
            ...component
        };

        setSelectedComponent(component);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!selectedComponent) return;

        e.preventDefault();

        const dropZone = dropZoneRef.current?.getBoundingClientRect();
        if (!dropZone) return;

        let x = e.clientX;
        let y = e.clientY;

        const elementRef = document.getElementById(`component-${selectedComponent.uniqueId}`);

        let width = selectedComponent.width;
        let height = selectedComponent.height;

        if (elementRef) {
            const rect = elementRef.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            x = Math.max(dropZone.left + 4, Math.min(x, dropZone.left + dropZone.width - width - 4));
            y = Math.max(dropZone.top + 4, Math.min(y, dropZone.top + dropZone.height - height - 4));
        }

        const xPercent = ((x - dropZone.left) / dropZone.width) * 100;
        const yPercent = ((y - dropZone.top) / dropZone.height) * 100;

        const newComponent: Component = {
            ...selectedComponent,
            x: xPercent,
            y: yPercent,
            width,
            height
        };

        const exists = components.some(comp => comp.uniqueId === selectedComponent.uniqueId);

        setComponents(prevComponents => [
            ...prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId),
            newComponent
        ]);

        if (exists) {
            updateElement(newComponent); 
        } else {
            createNewElement(newComponent);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDelete = async () => {
        if (!selectedComponent) return;

        setComponents(prevComponents => prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId));
        
        try {

            const accessToken = localStorage.getItem('accessToken');
            const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 
                    'Authorization': 'Bearer ' + accessToken, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    view: view,
                    uniqueId: selectedComponent.uniqueId
                }),
            });

            if (response.ok) toast.success('Element deleted successfully');
            else toast.error('Failed to delete element');
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
        }

        setSelectedComponent(null);
    };

    const createNewElement = async (element: Component) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

            await fetch(url, {
                method: 'POST',
                headers: accessToken ? { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' } : {},
                body: JSON.stringify({ ...element, view }),
            });

            toast.success('Element created successfully');
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
        }
    };

    const updateElement = async (element: Component) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

            await fetch(url, {
                method: 'PATCH',
                headers: { 
                    'Authorization': 'Bearer ' + accessToken, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(element),
            });

            toast.success('Element updated successfully');
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
        }
    };

    const renderComponent = (component: Component) => (
        <div
            key={component.uniqueId}
            id={`component-${component.uniqueId}`}
            style={{
                position: 'absolute',
                left: `${component.x}%`,
                top: `${component.y}%`,
            }}
            className={`border-2 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
            onMouseDown={(e) => handleMouseDown(e, component)}
            draggable
        >
            {component.type === "announcement" && <Announcement uniqueId={component.uniqueId} text={component.text}/>}
            {component.type === "fieldInformation" && <FieldInformation />}
            {component.type === "memberList" && <MemberList />}
        </div>
    );

    return (
        <div className="flex h-screen">
        <button 
            className="absolute top-20 left-2 p-2 bg-grey-400 text-white rounded"
            onClick={() => setIsToolboxOpen(!isToolboxOpen)}
        >
           <Image 
                    src={isToolboxOpen ? "/bx-window-close.svg"  : "/bx-window-open.svg"} 
                    alt="Toolbox Icon" 
                    width={24} 
                    height={24} 
                />
            </button> 
        {isToolboxOpen && (
            <div className="w-80% bg-gray-200 mb-20">
                <div className="p-4 border">
                    <h3 className="text-lg font-bold mb-4 mt-8 text-black">Verktøykasse</h3>
                    {["announcement", "fieldInformation", "memberList"].map((type) => (
                        <div
                            key={type}
                            className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                            draggable
                            onMouseDown={(e) => handleMouseDown(e, {
                                type,
                                uniqueId: Date.now(),
                                x: 0,
                                y: 0,
                                width: 0,
                                height: 0,
                                text: ""
                            })}
                        >
                            {type === "announcement" && "Kunngjøringer"}
                            {type === "fieldInformation" && "Baneinformasjon"}
                            {type === "memberList" && "Medlemsliste"}
                        </div>
                    ))}
                </div>
                  {/* Knapp for å bytte mellom nonmember og member visning */}
                  <div className="flex justify-around p-4 border-t mt-88">
                        <button onClick={() => setCurrentView("member")}>
                            <Image 
                                src="/bxs-user-check.svg" 
                                alt="Member View" 
                                width={40} 
                                height={40} 
                                className={currentView === "member" ? "border-2 border-blue-500 rounded-lg" : ""}
                            />
                        </button>
                        <button onClick={() => setCurrentView("nonmember")}>
                            <Image 
                                src="/bxs-user-x.svg" 
                                alt="Nonmember View" 
                                width={40} 
                                height={40} 
                                className={currentView === "nonmember" ? "border-2 border-blue-500 rounded-lg" : ""}
                            />
                        </button>
                    </div>
            </div>
        )}

            {/* Område for å plassere og flytte på elementene */}
            <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onMouseDown={() => setSelectedComponent(null)}
                className="bg-gray-200 w-full border-2 border-black rounded-lg ml-1 mr-1 mb-20 mt-2"
            >
                {components.map(renderComponent)}
            </div>

            {/* Slett-knapp */}
            {selectedComponent && (
                <div className="absolute bottom-4 left-4 p-2 bg-red-500 text-white rounded cursor-pointer" onClick={handleDelete}>
                    Slett figur
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Toolbox;

