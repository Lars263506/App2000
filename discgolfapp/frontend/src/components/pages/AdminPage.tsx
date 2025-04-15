import React from 'react'
import WithAdminAccess from '../adminpage/withadminaccess';
import Settings from '@/components/adminpage/settings'
import WithPageEditAccess from '../adminpage/withpageeditaccess';

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
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
