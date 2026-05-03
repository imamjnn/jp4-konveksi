import axios from "axios";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // ambil message dari backend kalau ada
      const message = error.response?.data?.error || "Unauthorized";

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

export default api;
