import axios from 'axios';

// Creamos una instancia de axios configurada con la URL base de las variales de entorno
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        // Buscamos si hay un token guardado en el navegador (Local Storage)
        const token = localStorage.getItem('token');
        
        // Si hay token, se lo pegamos en los Headers automáticamente
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
