import React from 'react'
import Settings from '@/components/adminpage/Settings'
import WithPageEditAccess from '../adminpage/WithEditPageAccess';

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
*/

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

interface AdminPageProps {
    setSelectedPage: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ setSelectedPage }) => {
    return (
        <WithPageEditAccess>
            <Settings setSelectedPage={setSelectedPage}/>
        </WithPageEditAccess>
    );
};

export default AdminPage;
