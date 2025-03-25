import { useState } from 'react';

interface FetchProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body: unknown;
  expectedStatus: number;
  customErrorMessage: string;
}

const useFetch = ({ endpoint, method, body, expectedStatus, customErrorMessage }: FetchProps) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('No access token found when fetching data, try logging in.');
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${endpoint}`;

      if (!process.env.NEXT_PUBLIC_PROTOCOL || !url.includes(process.env.NEXT_PUBLIC_PROTOCOL)) {
        setError('Invalid protocol in URL, make sure to include the correct protocol in the URL.');
        return;
      }

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === expectedStatus) {
        const data = await response.json();
        setData(data);
      } else {
        setError(customErrorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(customErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetch: fetchData };
};

export default useFetch;
