import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !config.url.includes("/api/auth/login") &&
    !config.url.includes("/api/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
