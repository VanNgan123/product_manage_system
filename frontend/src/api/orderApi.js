import axiosClient from "./axiosClient";

export const orderApi = {
    getAll: (params) => {
        return axiosClient.get("/orders/", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/orders/${id}/`);
    },

    updateStatus: (id, data) => {
        return axiosClient.patch(`/orders/${id}/status/`, data);
    },
};
