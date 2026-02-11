import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
});

export const checkHealth = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/`);
        return res.data;
    } catch (error) {
        console.error("API Health Check Failed", error);
        return null;
    }
};

export default api;
