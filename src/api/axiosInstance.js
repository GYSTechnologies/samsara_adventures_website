// import axios from 'axios';

// const axiosInstance = axios.create({
//   // baseURL: 'http://localhost:3030', // Must match your backend port (3030)
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 60000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export default axiosInstance;

// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

// Don't set Content-Type globally. Let browser set it for FormData requests.
axiosInstance.defaults.headers.common["Accept"] = "application/json";

export default axiosInstance;
