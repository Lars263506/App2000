import { useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import Announcement from "./announcements";
import FieldInformation from "./fieldinformation";
import MemberList from "./memberlist";
import '../../app/globals.css';
import router from "next/router";
import 'react-toastify/dist/ReactToastify.css';

type Elements = {
    nonMemberElements: Component[];
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
};

const Toolbox: React.FC<ToolboxProps> = ({clubId}) => {

    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [view , setView] = useState<"nonmember" | "member" | "clubowner">("nonmember");

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
                if (data.nonMemberElements) {
                    setComponents(data.nonMemberElements);
                } 
                else if (data.memberElements) {
                    setComponents(data.memberElements);
                }   

            } catch (error: unknown) { 
                if (error instanceof Error) 
                    toast.error(error.message);
            } 
        };

        if (id) {
            fetchElements();
        }
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, []);
    
    const handleMouseDown = (e: React.MouseEvent, component: Component) => {
        setSelectedComponent(component);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selectedComponent) return;

        e.preventDefault();

        const dropZone = e.currentTarget.getBoundingClientRect();
        
        setSelectedComponent(prevComponent => {
            if (!prevComponent) return null;

            return {
                ...prevComponent,
                x: e.clientX - dropZone.left, 
                y: e.clientY - dropZone.top,
                width: selectedComponent.width,
                height: selectedComponent.height,
            };
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        if(!selectedComponent) return;

        let isNew = true;
        for (const component of components) {
            if (selectedComponent.uniqueId === component.uniqueId) 
                isNew = false;
        };

        e.preventDefault();

        const dropZone = e.currentTarget.getBoundingClientRect();
        
        const x = e.clientX - dropZone.left;
        const y = e.clientY - dropZone.top;
        const width = selectedComponent.width;
        const height = selectedComponent.height;

        const newComponent: Component = {
            type: selectedComponent.type,
            uniqueId: selectedComponent.uniqueId,
            x,
            y,
            width, 
            height
        };

        setComponents(prevComponents => [
            ...prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId), 
            newComponent
        ]);

        console.log("New component" + newComponent.width + " " + newComponent.height);

        if (isNew) {
            createNewElement(newComponent); 
        } else 
            updateElement(newComponent);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDelete = () => {
        if (!selectedComponent) return;
        setComponents(prevComponents => prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId));
    };

    const createNewElement = async (element: Component) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

            await fetch(url, {
                method: 'POST',
                headers: accessToken ? { 'Authorization': 'Bearer ' + accessToken } : {},
                body: JSON.stringify({...element, view}),
            });
            toast.success('Element created successfully');
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    const updateElement = async (element: Component) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + id;

            await fetch(url, {
                method: 'PATCH',
                headers: accessToken ? { 'Authorization': 'Bearer ' + accessToken } : {},
                body: JSON.stringify(element),
            });
            toast.success('Element updated successfully');
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    const renderComponent = (component: Component) => { 

        return (
            <div 
                key={component.uniqueId}
                style={{ position: 'absolute', left: component.x, top: component.y  }}
                className={`p-4 border-4 bg-gray-200 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, component)}
                onMouseMove={handleMouseMove}
                draggable
            >
                {component.type === "announcement" && (
                    <Announcement/>
                )}  
                {component.type === "fieldInformation" && (
                    <FieldInformation/>
                )}
                {component.type === "memberList" && (
                    <MemberList/>
                )}
            </div>
        )};

    return (
        <div
            className="flex h-screen"
        >
            {/* Toolbox på venstre side */}
            <div className="w-80% bg-gray-200 mb-20">
                <div className="p-4 border">
                    <h3 className="text-lg font-bold mb-4 text-black">Verktøykasse</h3>
                    <div
                        id="announcement"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onMouseDown={(e) => handleMouseDown(e, { 
                            type: "announcement", 
                            uniqueId: Date.now(), 
                            x: 0, 
                            y: 0, 
                            width: 0,
                            height: 0
                        })}
                    >
                        Kunngjøringer
                    </div>
                    <div
                        id="fieldInformation"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onMouseDown={(e) => handleMouseDown(e, { 
                            type: "fieldInformation", 
                            uniqueId: Date.now(), 
                            x: 0, 
                            y: 0, 
                            width: 0,
                            height: 0
                        })}
                    >
                        Bane informasjon
                    </div>
                    <div
                        id="memberList"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onMouseDown={(e) => handleMouseDown(e, { 
                            type: "memberList", 
                            uniqueId: Date.now(), 
                            x: 0, 
                            y: 0, 
                            width: 0,
                            height: 0
                        })}
                    >
                        Medlems liste
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-2 py-1 bg-black text-white rounded rounded-mg mt-32"
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
                onDrop = {e => handleDrop(e)}
                onDragOver={handleDragOver}
                className="w-full bg-gray-200 p-4 pr-[1400px] border-2 border-black rounded-lg ml-1 mb-20 mt-2"
            >
                {components.map(renderComponent)}
            </div>

            {/* Slett-knapp som vises når en figur er valgt */}
            {true && (
                <div className="absolute bottom-4 left-4 p-2 bg-red-500 text-white rounded cursor-pointer" onClick={handleDelete}>
                    Slett figur
                </div>
            )}
            <ToastContainer /> 
        </div>
        
    );
};

export default Toolbox;
