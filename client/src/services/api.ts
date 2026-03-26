import axios from 'axios';

const normalizeBaseUrl = (value: string) => {
    const trimmed = value.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const getGuestId = () => {
    if (typeof window === 'undefined') return 'server_side_guest';
    let guestId = localStorage.getItem('deepdetect_guest_id');
    if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('deepdetect_guest_id', guestId);
    }
    return guestId;
};

const isBrowserLocalhost = () => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const resolveApiBaseUrl = () => {
    const configured = normalizeBaseUrl(import.meta.env.VITE_API_URL || '');
    if (!configured) return '';

    const pointsToLocalhost = configured.includes('localhost') || configured.includes('127.0.0.1');
    if (pointsToLocalhost && !isBrowserLocalhost()) {
        // Prevent broken hosted builds caused by local-only env values.
        return '';
    }

    return configured;
};

const resolvedApiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
    baseURL: `${resolvedApiBaseUrl}/api`,
});

export const postWithApiFallback = async <T>(path: string, payload: T, config?: Parameters<typeof api.post>[2]) => {
    try {
        return await api.post(path, payload, config);
    } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
            return axios.post(`/api${path}`, payload, config);
        }
        throw error;
    }
};

export const getWithApiFallback = async (path: string, config?: Parameters<typeof api.get>[1]) => {
    try {
        return await api.get(path, config);
    } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
            return axios.get(`/api${path}`, config);
        }
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        const res = await axios.get(`${resolvedApiBaseUrl}/`);
        return res.data;
    } catch (error) {
        console.error("API Health Check Failed", error);
        return null;
    }
};

export const getApiHostLabel = () => resolvedApiBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

export default api;
