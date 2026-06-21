import axiosClient from "./axiosClient";

export const authApi = {
    login: (data) => {
        return axiosClient.post("/auth/login/", data);
    },

    refresh: (data) => {
        return axiosClient.post("/auth/refresh/", data);
    },
};
