// services/apiService.ts
import axios, { AxiosInstance } from 'axios';

// Crear una instancia de Axios con la configuración base de tu API
const api: AxiosInstance = axios.create({
  baseURL: 'https://aguas-cordobesas.vercel.app', // Cambia esto a la URL de tu API
  timeout: 10000, // Tiempo máximo de espera para una solicitud en milisegundos
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar más encabezados aquí si es necesario
  },
});

// Manejar respuestas y errores
api.interceptors.response.use(
  response => response.data,
  error => {
    // Puedes manejar errores globalmente aquí
    return Promise.reject(error);
  }
);

// Funciones para interactuar con la API
export const get = (url: string, params?: object) => api.get(url, { params });
export const post = (url: string, data: object) => api.post(url, data);
export const put = (url: string, data: object) => api.put(url, data);
export const del = (url: string) => api.delete(url);

export default api;
