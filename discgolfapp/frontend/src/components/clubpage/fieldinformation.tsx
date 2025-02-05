import { useState, useEffect } from "react";

const FieldInformation = ({ location }: { location: string }) => {
    const [fields, setFields] = useState<any[]>([]);

    // Denne useEffect kan brukes til å hente data fra backend senere
    useEffect(() => {
        // Simulerer backend-henting av data etter at komponenten er montert
        // Senere kan du erstatte dette med en API-kall til backend for å hente feltene basert på location

        // Eksempel på hvordan backend kan brukes (må implementeres senere)
        /*
        fetch(`/api/fields?location=${location}`)
            .then(response => response.json())
            .then(data => setFields(data))
            .catch(err => console.error("Error fetching fields:", err));
        */
        
        // Denne setFields kan fjernes når du integrerer backend.
        setFields([]);  // Setter en tom liste til å starte med.
    }, [location]);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2 text-black">{location} - Discgolfbaner</h2>
            {fields.length > 0 ? (
                <ul className="list-disc pl-4">
                    {fields.map((field, index) => (
                        <li key={index} className="text-black">
                            <strong>{field.name}</strong> - {field.address} ({field.holes} hull)
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Ingen registrerte baner i {location}.</p>
            )}
        </div>
    );
};

export default FieldInformation;

