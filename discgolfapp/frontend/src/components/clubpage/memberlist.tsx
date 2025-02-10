import { useState, useEffect } from "react";

/**
 * @author Andreas Nilsen 
 * @description Line: 36-40, ChatGPT has helped with styling in tailwind.  
 */

type Member = {
    displayname: string;
};

const MemberList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulert API-kall, erstatt dette med en backend-kall senere
        const fetchMembers = async () => {
            try {
                //const response = await fetch('/api/members'); 
                //const data = await response.json();
                setMembers([{ displayname: "Ola Nordmann" }, { displayname: "Kari Nordmann" }]);

            } catch (error) {
                console.error("Feil ved henting av medlemmer:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white w-full">
            <h2 className="text-xl font-bold mb-2 text-black">Medlemsliste</h2>
            {loading ? (
                <p className="text-gray-500">Laster medlemmer...</p>
            ) : members.length > 0 ? (
                <ul className="list-disc pl-4 text-black">
                    {members.map((member) => (
                        <li key={member.displayname}>{member.displayname}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Ingen medlemmer enda.</p>
            )}
        </div>
    );
};

export default MemberList;
