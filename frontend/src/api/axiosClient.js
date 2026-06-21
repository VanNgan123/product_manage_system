import axios from "axios";

const axiosClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
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

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Nếu access token hết hạn
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken =
                    localStorage.getItem(
                        "refreshToken"
                    );

                if (!refreshToken) {
                    throw new Error(
                        "Không có refresh token"
                    );
                }

                const response = await axios.post(
                    "http://localhost:8000/api/auth/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken =
                    response.data.access;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem(
                    "accessToken"
                );
                localStorage.removeItem(
                    "refreshToken"
                );

                window.location.href =
                    "/login";

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
