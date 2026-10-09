// // import axios from 'axios';
// // import React from 'react'

// // const AxiosWithAuth = () => {

// //     return axios.create({
// //         baseURL: 'http://localhost:5000/api/v1/',

// //     });
// // };

// // export default AxiosWithAuth;


// import axios from 'axios';

// export const imageUpload =
//     import.meta.env.MODE === "development"
//         ? `http://${window.location.hostname}:5000`
//         : "https://investment-backend-kfv5.onrender.com";

// const AxiosWithAuth = () => {
//     return axios.create({
//         baseURL: "https://investment-backend-kfv5.onrender.com",
//         // baseURL: 'http://localhost:5000',
//         withCredentials: true,
//     });
// };

// export default AxiosWithAuth;

// import axios from 'axios';
// import React from 'react'

// const AxiosWithAuth = () => {

//     return axios.create({
//         baseURL: 'http://localhost:5000/api/v1/',

//     });
// };

// export default AxiosWithAuth;


import axios from 'axios';
import { endSession, getToken } from '../auth/session';

// Dev (npm run dev) talks to the local server; production builds use Render.
// Set VITE_API_URL to point either mode at a different API.
export const API_BASE_URL =
    (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') ||
    (import.meta.env.MODE === "development"
        ? `http://${window.location.hostname}:5000`
        : "https://investment-backend-p8j8.onrender.com");

export const imageUpload = API_BASE_URL;

// Stored images are either full URLs or upload paths on the API server.
export const resolveImage = (image) => {
    if (!image) return '';
    if (/^(https?:|data:|blob:)/.test(image)) return image;
    // Media library files keep their folder (/uploads/media/2026/10/<name>.webp).
    if (image.startsWith('/uploads/media/')) return `${API_BASE_URL}${image}`;
    return `${API_BASE_URL}/uploads/images/${encodeURIComponent(image.split('/').pop())}`;
};

const AxiosWithAuth = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        // Fail instead of spinning forever if the backend hangs (allows for Render cold starts)
        timeout: 60000,
    });

    // Protected routes expect a Bearer token; attach it unless the caller set one.
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // The backend's JWT expiry wins over the client timer: if the API says the stored
    // token is no longer valid, end the session in every tab. Other 401s (e.g. a wrong
    // current password) are ordinary errors and leave the session alone.
    instance.interceptors.response.use(undefined, (error) => {
        const status = error.response?.status;
        const message = String(error.response?.data?.error || error.response?.data?.message || '');
        const tokenRejected =
            (status === 401 && /token|not authorized/i.test(message)) ||
            (status === 404 && /found for this token/i.test(message));
        if (tokenRejected && error.config?.headers?.Authorization === `Bearer ${getToken()}`) {
            endSession('expired');
        }
        return Promise.reject(error);
    });

    return instance;
};

export default AxiosWithAuth;