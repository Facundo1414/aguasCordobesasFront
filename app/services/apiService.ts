import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', //TODO Cambia esto a la URL de tu API
  timeout: 10000,
});



// Funciones para interactuar con la API
export const get = async (url: string, params?: object) => {
  return api.get(url);
};

export const post = async (url: string, data: object) => {
  return api.post(url, data);
};

export const put = async (url: string, data: object) => {
  return api.put(url, data);
};

export const del = async (url: string) => {
  return api.delete(url);
};

export const uploadData = async (url: string, data: FormData, config?: object) => {
  return api.post(url, data, config);
};

// Verificar el estado de autenticación en WhatsApp
export const checkLoginWsp = async () => {
  try {
    const response: AxiosResponse<any> = await api.get('/api/isLoggedIn');
    return response.data;
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
    throw error;
  }
};


// Obtener el código QR desde el servidor
export const getFetchQRCode = async (): Promise<Blob | null> => {
  try { 
    const config = {
      responseType: 'blob' as const, // Asegura que la respuesta sea tratada como un blob
    };

    const response: AxiosResponse<Blob> = await api.get('/api/qrcode', config);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el QR code:', error);
    return null;
  }
};

// Subir un archivo Excel
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

// Obtener un archivo por su nombre
export const getFileByName = async (fileName: string): Promise<Blob> => {
  try {
    const token = "";
    const response = await fetch(`http://localhost:3000/api/getFileByName/${fileName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Incluye el token en los headers
      },
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

// Enviar y hacer scraping de un archivo
export const sendAndscrape = async (fileName: string): Promise<{ message: string, file?: Blob }> => {
  try {
    const response: AxiosResponse = await api.post(`/process/process-file/${fileName}`, {}, { responseType: 'blob' });

    const contentType = response.headers['content-type'];
    let message = 'Proceso completado con éxito.';
    let file: Blob | undefined;

    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      // Si la respuesta es un archivo Excel
      file = response.data;
    } else if (contentType && contentType.includes('application/json')) {
      // Si la respuesta es JSON, extrae el mensaje
      const data = await response.data.text();
      const jsonData = JSON.parse(data);
      message = jsonData.message || message;
    }

    return { message, file };
  } catch (error: any) {
    console.error('Error al iniciar el proceso:', error);
    throw new Error(error.message || 'Error al iniciar el proceso');
  }
};

export default api;
