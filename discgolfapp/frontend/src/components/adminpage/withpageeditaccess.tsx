import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

/**
 * @author Lars Andreas Strand
 * @description Wrapper for components that require admin access.
 */

interface WithPageEditAccessProps {
  children: React.ReactNode;
}

const WithPageEditAccess: React.FC<WithPageEditAccessProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

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
  }, []);

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
