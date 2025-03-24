import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * @author Lars Andreas Strand
 * @description Wrapper for components that require admin access.
 */

interface WithAdminAccessProps {
  children: React.ReactNode;
  setSelectedPage: (page: string) => void;
}

const WithAdminAccess: React.FC<WithAdminAccessProps> = ({ children, setSelectedPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setSelectedPage('Home');
        setIsLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/admin`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          const data: { isAdmin: boolean } = await response.json();
          if (data.isAdmin) {
            setHasAccess(true);
          } else {
            toast.error('Du har ikke tilgang til denne siden.');
            setSelectedPage('Home');
          }
        } else {
          toast.error('Det var en feil med å sjekke om du har admin-tilgang. Prøv igjen senere.');
          setSelectedPage('Home');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Det var en feil med å sjekke om du har admin-tilgang. Prøv igjen senere.');
        }
        setSelectedPage('Home');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Laster...</h1>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Ingen adgang</h1>
        <p>Du må logge inn for å se denne siden.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default WithAdminAccess