import { useState, useEffect } from "react";

const MemberList = ({ clubName }: { clubName: string }) => {
    const [members, setMembers] = useState<string[]>([]);

    // Denne useEffect kan brukes til å hente data fra backend senere
    useEffect(() => {
        // Simulerer backend-henting av medlemsdata
        // Senere kan du erstatte dette med en API-kall til backend for å hente medlemmene basert på klubbnavn
        
        // Eksempel på hvordan backend kan brukes (må implementeres senere)
        /*
        fetch(`/api/members?clubName=${clubName}`)
            .then(response => response.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err));
        */

        // Denne setMembers kan fjernes når du integrerer backend.
        setMembers([]);  // Setter en tom liste til å starte med.
    }, [clubName]);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2 text-black">{clubName} - Medlemsliste</h2>
            <ul className="list-disc pl-4">
                {members.length > 0 ? (
                    members.map((member, index) => (
                        <li key={index} className="text-black">{member}</li>
                    ))
                ) : (
                    <p className="text-gray-500">Ingen medlemmer ennå.</p>
                )}
            </ul>
        </div>
    );
}

export default MemberList;
