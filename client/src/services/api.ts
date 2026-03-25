import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const normalizedApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const api = axios.create({
    baseURL: `${normalizedApiUrl}/api`,
});

export const checkHealth = async () => {
    try {
        const res = await axios.get(`${normalizedApiUrl}/`);
        return res.data;
    } catch (error) {
        console.error("API Health Check Failed", error);
        return null;
    }
};

export default api;
