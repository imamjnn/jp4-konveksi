import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 🔐 REQUEST INTERCEPTOR (attach token)
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔄 RESPONSE INTERCEPTOR (handle 401 + refresh token)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // kalau unauthorized & belum pernah retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // request refresh token ke backend
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = res.data.data.accessToken;

        // simpan token baru
        Cookies.set("accessToken", newAccessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        // update header & retry request lama
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // refresh gagal → logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    // const message =
    //   error.response?.data?.error || error.message || "Request failed";

    return Promise.reject(error);
  },
);

export default api;
