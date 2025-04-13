import { toast } from 'react-toastify';

const validateSession = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) return;

    try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/validate-session`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        }
    });

    if (response.status === 401) {
        try {
        const refreshUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/refresh-session`;
        const response = await fetch(refreshUrl, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
            }
        });
        const data = await response.json();
        if (response.status === 200 && data.newAccessToken && data.newRefreshToken) {
            alert('Session refreshed successfully!');
            localStorage.setItem('accessToken', data.newAccessToken);
            localStorage.setItem('refreshToken', data.newRefreshToken);
        } else {
            localStorage.setItem('accessToken', '');
            localStorage.setItem('refreshToken', '');
            return;
        }
        } catch (error) {
        toast.error('Error validating session. Please try again later.');
        }
        return;
    }
    } catch (error) {
    toast.error('Error validating session. Please try again later.');
    }
};

export default validateSession;
