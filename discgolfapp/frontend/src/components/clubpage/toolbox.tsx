import { useEffect, useState } from "react";
import Announcement from "./announcements";
import FieldInformation from "./fieldinformation";
import MemberList from "./memberlist";
import '../../app/globals.css';
import router from "next/router";

type Component = {
    id: string;
    uniqueId: number;
    x: number;
    y: number;
    content: string;
};

const Toolbox = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, []);

    const [idCounter, setIdCounter] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    
    const handleMouseDown = (e: React.MouseEvent, component: Component) => {
        setSelectedComponent(component);
    };

    const handleDrop = (e: React.DragEvent) => {
        if(!selectedComponent) return;

        setIdCounter(prevIdCounter => prevIdCounter + 1);

        e.preventDefault();

        const dropZone = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - dropZone.left;
        const y = e.clientY - dropZone.top;

        const newComponent: Component = {
            id: selectedComponent.id,
            uniqueId: idCounter,
            x,
            y,
            content: selectedComponent.content
        };

        setComponents(prevComponents => [
            ...prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId), 
            newComponent
        ]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDelete = () => {
        if (!selectedComponent) return;
        setComponents(prevComponents => prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId));
    };

    const renderComponent = (component: Component) => { 
        return (
            <div
                key={component.uniqueId}
                style={{ position: 'absolute',  left: component.x, top: component.y }}
                className={`p-4 border-4 bg-gray-200 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, component)}
                draggable
            >
                {component.id === "announcement" && (
                    <Announcement/>
                )}
                {component.id === "fieldInformation" && (
                    <FieldInformation/>
                )}
                {component.id === "memberList" && (
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
                        onMouseDown={(e) => handleMouseDown(e, { id: "announcement", uniqueId: idCounter, x: 0, y: 0, content: "" })}
                    >
                        Kunngjøringer
                    </div>
                    <div
                        id="fieldInformation"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onMouseDown={(e) => handleMouseDown(e, { id: "fieldInformation", uniqueId: idCounter, x: 0, y: 0, content: "" })}
                    >
                        Bane informasjon
                    </div>
                    <div
                        id="memberList"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onMouseDown={(e) => handleMouseDown(e, { id: "memberList", uniqueId: idCounter, x: 0, y: 0, content: "" })}
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
        </div>
        
    );
};

export default Toolbox;
