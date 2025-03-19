import React from 'react'
import Settings from '@/components/adminpage/settings'

/**
 * @author Lars Andreas Strand
 * @description Page used by admins to change settings relevant to the website.
 * This page is only accessible by users with the role 'admin'.
*/

const AdminPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Settings />
        </div>
    );
};

export default AdminPage;
