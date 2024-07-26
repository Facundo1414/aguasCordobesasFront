// services/apiService.ts
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto a la URL de tu API
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Manejar respuestas y errores
api.interceptors.response.use(
  response => response.data,
  error => {
    return Promise.reject(error);
  }
);

// Funciones para interactuar con la API
export const get = (url: string, params?: object) => api.get(url, { params });
export const post = (url: string, data: object) => api.post(url, data);
export const put = (url: string, data: object) => api.put(url, data);
export const del = (url: string) => api.delete(url);
export const uploadData = (url: string, data: FormData, config?: object) => api.post(url, data, config);



export default api;
