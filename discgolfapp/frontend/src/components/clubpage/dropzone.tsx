import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';

import '../../app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Announcement from "./announcements";
import FieldInformation from "./fieldinformation";
import MemberList from "./memberlist";

type DropZoneProps = {
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

type Elements = {
    nonmemberElements: Component[];
    memberElements: Component[];
};

const DropZone: React.FC<DropZoneProps> = ({ clubId, view }) => {
    const id = clubId ?? process.env.NEXT_PUBLIC_DEFAULT_CLUBID;
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [components, setComponents] = useState<Component[]>([]);

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


    const handleDrop = (e: React.DragEvent) => {
        if (!selectedComponent) return;

        e.preventDefault();

        const dropZone = dropZoneRef.current?.getBoundingClientRect();
        if (!dropZone) return;

        let x = e.clientX - dropZone.left;
        let y = e.clientY - dropZone.top;

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

        if (exists) {
            updateElement(newComponent); 
        } else {
            createNewElement(newComponent);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
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
            className={`border-2 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
            onMouseDown={(e) => handleMouseDown(e, component)}
            draggable
        >
            {component.type === "announcement" && <Announcement uniqueId={component.uniqueId} text={component.text}/>}
            {component.type === "fieldInformation" && <FieldInformation />}
            {component.type === "memberList" && <MemberList />}
        </div>
    );

    const handleMouseDown = (e: React.MouseEvent, component: Component) => {
        
        e.stopPropagation();

        component = {
            ...component
        };

        setSelectedComponent(component);
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
    
    return <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={() => setSelectedComponent(null)}
        className="bg-gray-200 w-full border-2 border-black rounded-lg ml-1 mr-1 mb-20 mt-2"
    >
        {components.map(renderComponent)}
        <ToastContainer />
    </div>;

};
