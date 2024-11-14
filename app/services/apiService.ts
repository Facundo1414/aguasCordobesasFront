import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});



// Funciones para interactuar con la API
export const get = async (url: string, params?: object, token?: string) => {
  const config: AxiosRequestConfig = {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
  return api.get(url, config);
};

export const post = async (url: string, data: object, token?: string) => {
  const config: AxiosRequestConfig = {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
  return api.post(url, data, config);
};

export const put = async (url: string, data: object, token?: string) => {
  const config: AxiosRequestConfig = {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
  return api.put(url, data, config);
};

export const del = async (url: string, token?: string) => {
  const config: AxiosRequestConfig = {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
  return api.delete(url, config);
};

export const uploadData = async (url: string, data: FormData, token?: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  return api.post(url, data, config);
};

// Verificar el estado de autenticación en WhatsApp
export const getIsLoggedIn = async (token?: string) => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const response: AxiosResponse<any> = await api.get('/api/whatsapp/isLoggedIn', config);
    return response.data;
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
    throw error;
  }
};

// iniciar sesión en WhatsApp
export const initializeWhatsAppSession = async (token?: string): Promise<{ clientId?: string; qrCode?: string, message?: string }> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const response = await api.get('/api/whatsapp/initialize', config);
    return response.data; // Devuelve el objeto con "clientId" y "qrCode" si están presentes
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
    throw error;
  }
};




// Subir un archivo Excel
export const uploadExcelFile = async (url: string, formData: FormData, token: string) => {
  try {
    const response: AxiosResponse<any> = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
export const getFileByName = async (fileName: string, token: string): Promise<Blob> => {
  try {
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
export const sendAndScrape = async (
  fileName: string,
  token: string
): Promise<{ message: string; file?: Blob }> => {
  try {
    // Configuración del request con el Bearer token
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    };

    // Realizar la solicitud de envío y scraping
    const response: AxiosResponse = await api.post(
      `/process/process-file`,
      {
        filename: fileName,
        message: '',
        expiration: 1
      },
      config
    );

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



export const userLogin = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw new Error('Credenciales inválidas');
  }
};

export const userLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

export default api;
