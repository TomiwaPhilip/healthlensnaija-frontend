import axios from "axios";

console.log(
  "⛰️ MODE:", import.meta.env.MODE,
  "| API_URL:", import.meta.env.VITE_API_URL
);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Public paths that should never trigger a redirect to /signin
const PUBLIC_PATHS = [
  "/", "/signin", "/signup", "/about", "/contact", "/features",
  "/forgot-password", "/reset-password", "/verify-email",
  "/verify-otp", "/pending-verification", "/oauth/callback",
];

const isPublicPath = () => {
  const path = window.location.pathname;
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
};

// Attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 + refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("❌ Axios Interceptor Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");

          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("token", newAccessToken);

          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          if (!isPublicPath()) {
            window.location.href = "/#/signin";
          }
          return Promise.reject(refreshError);
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (!isPublicPath()) {
        window.location.href = "/#/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
