import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

/**
 * WithAdminAccess Component
 * A wrapper component that ensures only users with admin access can view the wrapped content.
 * Displays a loading state while checking access and hides content if the user lacks admin privileges.
 * 
 * @author Lars Andreas Strand and Andreas Nilsen
 */

/**
 * Props for the WithAdminAccess component
 * @typedef {Object} WithAdminAccessProps
 * @property {React.ReactNode} children - The content to display if the user has admin access.
 * @author Lars Andreas Strand
 */

interface WithAdminAccessProps {
  children: React.ReactNode;
}

const WithAdminAccess: React.FC<WithAdminAccessProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    /**
     * Fetches admin access status from the backend.
     * Updates the state to reflect whether the user has admin access.
     * Displays an error toast if the fetch operation fails.
     * 
     * @function fetchData
     * @returns {Promise<void>}
     * @author Lars Andreas Strand and Andreas Nilsen
     */
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/admin`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}`},
        });

        if (response.status === 200) {
          const data: { isAdmin: boolean } = await response.json();
          if (data.isAdmin) {
            setHasAccess(true);
          }
        } else {
          toast.error(t("error_fetching_admin_status"));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(t("error_fetching_admin_status"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>{t("withadminaccess_loading")}</h1>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <></>
    )
  }

  return <>{children}</>;
};

export default WithAdminAccess
