import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD ? 'https://backend-tools76.vercel.app/api' : 'http://localhost:5000/api',
});



export default api;
