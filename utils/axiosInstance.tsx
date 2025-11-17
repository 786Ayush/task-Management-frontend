import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // your backend URL
  withCredentials: true, // ⭐ VERY IMPORTANT (sends cookies)
});

// 🔄 Auto Refresh Logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired AND request is not refresh call itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.get("/auth/refresh-token"); // get new access token
          isRefreshing = false;
          onRefreshed("done");
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
