import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const checkHealth = async () => {
    try {
        const res = await axios.get('http://localhost:5000/');
        return res.data;
    } catch (error) {
        console.error("API Health Check Failed", error);
        return null;
    }
};

export default api;
