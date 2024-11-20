import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  timeout: 180000,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
  },
  httpsAgent: agent, // Deshabilita validación SSL

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
    const response: AxiosResponse<any> = await api.get('/whatsapp/isLoggedIn', config);
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
    const response = await api.get('/whatsapp/initialize', config);
    return response.data; // Devuelve el objeto con "clientId" y "qrCode" si están presentes
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
    throw error;
  }
};




// Subir un archivo Excel
export const uploadExcelFile = async ( formData: FormData, token: string) => {
  try {
    const response: AxiosResponse<any> = await api.post("/upload/excel", formData, {
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
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Asegura que la respuesta sea tratada como un Blob
    };

    const response: AxiosResponse<Blob> = await api.get(`/upload/getFileByName/${fileName}`, config);

    return response.data; // Devuelve el archivo como un Blob
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    throw new Error('Error al obtener el archivo');
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

export const userLogout = async (token: string) => {
  try {
    await api.post(
      '/auth/logout',
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error en logout:', error);
    alert('Error al cerrar sesión. Por favor, intente de nuevo.');
  }
};



export const checkFileStatus = async (fileName: string, token: string) => {
  try {
    // Realizar la petición GET al endpoint '/upload/file-status'
    const response = await get('/upload/file-status', { filename: fileName }, token);
    
    // Manejar la respuesta dependiendo del estado
    if (response.data.status === 'processed') {
      console.log('El archivo ha sido procesado:', response.data.message);
    } else if (response.data.status === 'processing') {
      console.log('El archivo está siendo procesado:', response.data.message);
    } else {
      console.log('Estado desconocido:', response.data.message);
    }
  } catch (error) {
    console.error('Error al verificar el estado del archivo:', error);
  }
};


// Verificar si el token del usuario sigue siendo válido
export const checkValidateToken = async (token: string): Promise<boolean> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response: AxiosResponse<any> = await api.post('/auth/validate-token', {}, config);

    return response.status === 200;
  } catch (error) {
    console.error('Error al validar el token:', error);
    return false;
  }
};

export const refreshToken = async (refreshToken: string) => {

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`/auth/refresh`, { refreshToken });

    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing token', error);
    throw new Error('Error refreshing token');
  }
};

export default api;
