import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

/**
 * WithPageEditAccess Component
 * A wrapper component that ensures only users with edit access can view the wrapped content.
 * Displays a loading state while checking access and hides content if the user lacks edit privileges.
 * 
 * @author Andreas Nilsen
 */

/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

/**
 * Props for the WithPageEditAccess component
 * @typedef {Object} WithPageEditAccessProps
 * @property {React.ReactNode} children - The content to display if the user has edit access.
 * @author Andreas Nilsen
 */

interface WithPageEditAccessProps {
  children: React.ReactNode;
}

const WithPageEditAccess: React.FC<WithPageEditAccessProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  /**
     * Fetches edit access status from the backend.
     * Updates the state to reflect whether the user has edit access.
     * Displays an error toast if the fetch operation fails.
     * 
     * @function fetchData
     * @returns {Promise<void>}
     * @author Andreas Nilsen
     */
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`;

        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          const data: { hasAccess: boolean } = await response.json();
          if (data.hasAccess) {
            setHasAccess(true);
          }
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

export default WithPageEditAccess;
