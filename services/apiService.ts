import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto a la URL de tu API
  timeout: 10000, 
});

// Funciones para interactuar con la API
export const get = (url: string, params?: object) => api.get(url, { params });
export const post = (url: string, data: object) => api.post(url, data);
export const put = (url: string, data: object) => api.put(url, data);
export const del = (url: string) => api.delete(url);

export const uploadData = (url: string, data: FormData, config?: object) => 
  api.post(url, data, config);

export const checkLoginWsp = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/isLoggedIn');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json(); // Ahora devuelve un objeto JSON
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
    throw error;
  }
};

export const getFetchQRCode = async (): Promise<Blob | null> => {
  try {
    const response = await fetch('http://localhost:3000/api/qrcode', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud del QR code');
    }

    const qrBlob = await response.blob();
    return qrBlob;  // Devuelve el Blob en lugar de una URL
  } catch (error) {
    console.error('Error al obtener el QR code:', error);
    return null;
  }
};

export const uploadExcelFile = async (url: string, formData: FormData) => {
  try {
    const response: AxiosResponse<any> = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.message) {
      return response.data; // Devolver los datos de la respuesta directamente
    } else {
      throw new Error('La respuesta del servidor no contiene el mensaje esperado.');
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw new Error('Error al subir el archivo');
  }
};


export const getFileByName = async (fileName: string): Promise<Blob> => {
  try {
    const response = await fetch(`http://localhost:3000/api/getFileByName/${fileName}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el archivo: ${response.statusText}`);
    }

    const fileBlob = await response.blob();
    return fileBlob;
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    throw error;
  }
};

export default api;
