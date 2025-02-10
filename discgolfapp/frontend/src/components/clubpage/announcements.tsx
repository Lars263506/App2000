import React, { useEffect, useState } from 'react';

type AnnouncementProps = {
    uniqueId: number;
    text: string;
};

const Announcement: React.FC<AnnouncementProps> = ({ uniqueId, text }) => {
    const [content, setContent] = useState<string>("");

    const accessToken = localStorage.getItem('accessToken');
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/text/' + uniqueId;

    const handleBlur = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                text: e.target.value
            })
        });
    }

    useEffect(() => {
        setContent(text);
    },[uniqueId]);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white w-full">
            <h2 className="text-xl font-bold mb-2 text-black">Kunngjøringer</h2>
            <textarea 
                className="p-2 border rounded-md text-black min-w-[300px]"
                placeholder="Skriv her..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={(e) => handleBlur(e)}
            />
        </div>
    );
}

export default Announcement;

