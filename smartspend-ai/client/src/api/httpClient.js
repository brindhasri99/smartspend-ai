import axios from "axios";

// Central API client: all authenticated frontend requests should go through this instance.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartspend_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("smartspend_token");
      localStorage.removeItem("smartspend_user");
    }
    return Promise.reject(error);
  }
);

export default api;
