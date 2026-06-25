import axiosClient from "./axiosClient";

export const authApi = {
    register: (data) => {
        return axiosClient.post("/auth/register/", data);
    },

    login: (data) => {
        return axiosClient.post("/auth/login/", data);
    },

    refresh: (data) => {
        return axiosClient.post("/auth/refresh/", data);
    },

    me: () => {
        return axiosClient.get("/auth/me/");
    },
};
