import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

interface UseFetchProps {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  expectedStatusCode: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

/**
 * @author Lars Andreas Strand
 * @description A custom hook for making API requests.
 * It handles token expiration and refreshes the token if needed.
 */

const useFetch = ({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  expectedStatusCode = 200,
  onSuccess,
  onError,
}: UseFetchProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (!endpoint) {
          throw new Error('Endpoint is required');
        }

        const accessToken = localStorage.getItem('accessToken');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('Token has expired and no refresh token is available');
          }

          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse || refreshResponse.status !== 200) {
            localStorage.removeItem('accessToken');
            throw new Error('Failed to refresh token');
          }

          const refreshData = await refreshResponse.json();

          const expirationMinutes = Number(process.env.NEXT_PUBLIC_EXPIRATION_MINUTES) || 60;
          const expirationTime = new Date().getTime() + expirationMinutes * 60 * 1000;

          localStorage.setItem('accessToken', refreshData.accessToken);
          localStorage.setItem('refreshToken', refreshData.refreshToken);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + endpoint;

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const responseData = await response.json();

        if (response.status === expectedStatusCode) {
          setData(responseData);
          if (onSuccess) onSuccess(responseData);
        }
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'message' in err) {
          setError((err as { message: string }).message);
        }
        else if (typeof err === 'string') {
          setError(err);
        } else {
          setError(t("error_generic"));
        }
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, headers, expectedStatusCode, onSuccess, onError]);

  return { data, loading, error };
};

export default useFetch;
