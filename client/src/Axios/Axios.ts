import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const instance = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
