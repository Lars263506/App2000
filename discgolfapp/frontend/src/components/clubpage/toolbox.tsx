import { useState, useEffect, useRef } from "react";
import Announcement from "./announcements";
import FieldInformation from "./fieldinformation";
import MemberList from "./memberlist";
import '../../app/globals.css';

type ComponentPosition = {
    id: string;
    x: number;
    y: number;
};

const Toolbox = () => {
    const [positions, setPositions] = useState<ComponentPosition[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null); // Tilstand for den valgte figuren
    const dragItem = useRef<ComponentPosition | null>(null);
    const dragOffset = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("id", id);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("id");

        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + dragOffset.current?.x!;  
        const y = rect.top + dragOffset.current?.y!;

        setPositions((prevPositions) => [
            ...prevPositions,
            { id, x, y },
        ]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        dragItem.current = positions.find((pos) => pos.id === id) || null;
        const rect = e.currentTarget.getBoundingClientRect();
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        setSelectedId(id); 
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragItem.current && dragOffset.current) {
            const x = e.clientX - dragOffset.current.x;
            const y = e.clientY - dragOffset.current.y;

            setPositions((prevPositions) =>
                prevPositions.map((pos) =>
                    pos.id === dragItem.current?.id ? { ...pos, x, y } : pos
                )
            );
        }
    };

    const handleMouseUp = () => {
        dragItem.current = null;
        dragOffset.current = null;
    };

    const handleDelete = () => {
        if (selectedId) {
            setPositions((prevPositions) =>
                prevPositions.filter((pos) => pos.id !== selectedId)
            );
            setSelectedId(null); 
        }
    };

    const renderComponent = (id: string, x: number, y: number) => (
        <div
            key={id}
            className={`p-4 border bg-gray-200 absolute ${selectedId === id ? 'border-red-200' : ''}`}
            style={{ left: `${x}px`, top: `${y}px` }}
            onMouseDown={(e) => handleMouseDown(e, id)}
        >
            {id === "announcement" && <Announcement />}
            {id === "fieldInformation" && <FieldInformation location={"Bø"} />}
            {id === "memberList" && <MemberList clubName={"My Club"} />}
        </div>
    );

    return (
        <div
            className="flex h-screen"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Toolbox på venstre side */}
            <div className="w-full bg-gray-200 relative mb-20">
                <div className="p-4 border">
                    <h3 className="text-lg font-bold mb-4 text-black">Verktøykasse</h3>
                    <div
                        id="announcement"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onDragStart={(e) => handleDragStart(e, "announcement")}
                    >
                        Kunngjøringer
                    </div>
                    <div
                        id="fieldInformation"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onDragStart={(e) => handleDragStart(e, "fieldInformation")}
                    >
                        Bane informasjon
                    </div>
                    <div
                        id="memberList"
                        className="p-3 bg-gray-400 border rounded-lg cursor-pointer text-black mt-10"
                        draggable
                        onDragStart={(e) => handleDragStart(e, "memberList")}
                    >
                        Medlems liste
                    </div>
                </div>
            </div>

            {/* Område for å plassere og flytte på elementene */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full bg-gray-200 relative p-4 pr-[1465px] border-2 border-black rounded-lg ml-2 mb-20 mt-2"
            >
                {positions.map((pos) => renderComponent(pos.id, pos.x, pos.y))}
            </div>

            {/* Slett-knapp som vises når en figur er valgt */}
            {selectedId && (
                <div className="absolute bottom-4 left-4 p-2 bg-red-500 text-white rounded cursor-pointer" onClick={handleDelete}>
                    Slett figur
                </div>
            )}
        </div>
    );
};

export default Toolbox;
