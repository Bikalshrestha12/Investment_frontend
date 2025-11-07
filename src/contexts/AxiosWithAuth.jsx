// import axios from 'axios';
// import React from 'react'

// const AxiosWithAuth = () => {

//     return axios.create({
//         baseURL: 'http://localhost:5000/api/v1/',

//     });
// };

// export default AxiosWithAuth;


import axios from 'axios';

export const imageUpload =
    import.meta.env.MODE === "development"
        ? `http://${window.location.hostname}:5000`
        : "https://investment-backend-kfv5.onrender.com";

const AxiosWithAuth = () => {
    return axios.create({
        baseURL: "https://investment-backend-kfv5.onrender.com",
        // baseURL: 'http://localhost:5000',
        withCredentials: true,
    });
};

export default AxiosWithAuth;