import Cookies from "js-cookie";

// authUtils.ts
export const getAccessToken = () => localStorage.getItem('accessToken');
export const saveAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token)
    Cookies.set('accessToken', token, { expires: 1 });
};
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const saveRefreshToken = (token: string) => {
    localStorage.setItem('refreshToken', token);
    Cookies.set('refreshToken', token , { expires: 1 });  
};




