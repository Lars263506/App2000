import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import router from "next/router";

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
};

type Component = {
    type: string;
    uniqueId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    _id?: string;
};

const Toolbox: React.FC<ToolboxProps> = ({ clubId }) => {
    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [view, setView] = useState<"nonmember" | "member" | "clubowner">("nonmember");
    
    const dropZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchElements = async () => {
            setView("nonmember"); // For now, we only support nonmember view, so this is hardcoded
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
    }, []);

    const handleMouseDown = (e: React.MouseEvent, component: Component) => {
        component = {
            ...component,
            width: 300,
            height: 300
        }

        setSelectedComponent(component);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!selectedComponent) return;

        e.preventDefault();

        const dropZone = dropZoneRef.current?.getBoundingClientRect();
        if (!dropZone) return;

        const x = e.clientX - dropZone.left;
        const y = e.clientY - dropZone.top;

        const elementRef = document.getElementById(`component-${selectedComponent.uniqueId}`);
        let width = selectedComponent.width;
        let height = selectedComponent.height;

        if (elementRef) {
            const rect = elementRef.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
        }

        const newComponent: Component = {
            ...selectedComponent,
            x,
            y,
            width,
            height
        };

        const exists = components.some(comp => comp.uniqueId === selectedComponent.uniqueId);

        setComponents(prevComponents => [
            ...prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId),
            newComponent
        ]);

        console.log(`Component updated - Width: ${width}, Height: ${height}`);

        if (exists) {
            updateElement(newComponent); // Oppdater eksisterende element
        } else {
            createNewElement(newComponent); // Lagre nytt element i backend
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
                left: component.x,
                top: component.y,
            }}
            className={`p-4 border-4 bg-gray-200 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
            onMouseDown={(e) => handleMouseDown(e, component)}
            draggable
        >
            {component.type === "announcement" && <Announcement />}
            {component.type === "fieldInformation" && <FieldInformation />}
            {component.type === "memberList" && <MemberList />}
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* Toolbox på venstre side */}
            <div className="w-80% bg-gray-200 mb-20">
                <div className="p-4 border">
                    <h3 className="text-lg font-bold mb-4 text-black">Verktøykasse</h3>
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
                                height: 0
                            })}
                        >
                            {type === "announcement" && "Kunngjøringer"}
                            {type === "fieldInformation" && "Baneinformasjon"}
                            {type === "memberList" && "Medlemsliste"}
                        </div>
                    ))}
                    <button
                        onClick={() => router.push('/')}
                        className="px-2 py-1 bg-black text-white rounded mt-32"
                    >
                        Til forsiden
                    </button>
                    <div className="text-black mt-40">
                        Klikk på figur så kommer knapp for å slette.
                    </div>
                </div>
            </div>

            {/* Område for å plassere og flytte på elementene */}
            <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full bg-gray-200 p-4 pr-[1400px] border-2 border-black rounded-lg ml-1 mb-20 mt-2"
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
