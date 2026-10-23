import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 1e4
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("saree_sansar_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);
export default apiClient;
