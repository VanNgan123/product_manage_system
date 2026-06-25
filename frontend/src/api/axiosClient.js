import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise = null;

const clearSessionAndRedirect = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (window.location.pathname !== "/login") {
        window.location.assign("/login");
    }
};

const refreshAccessToken = () => {
    if (!refreshPromise) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            return Promise.reject(new Error("Refresh token not found"));
        }

        refreshPromise = axios
            .post(`${BASE_URL}/auth/refresh/`, {
                refresh: refreshToken,
            })
            .then((response) => {
                const newAccessToken = response.data.access;
                localStorage.setItem("accessToken", newAccessToken);
                return newAccessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

axiosClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const isAuthRequest = [
            "/auth/login/",
            "/auth/register/",
            "/auth/refresh/",
        ].some((path) => originalRequest?.url?.includes(path));

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthRequest
        ) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (refreshError) {
                const refreshStatus = refreshError.response?.status;

                if (
                    !localStorage.getItem("refreshToken") ||
                    refreshStatus === 400 ||
                    refreshStatus === 401
                ) {
                    clearSessionAndRedirect();
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
