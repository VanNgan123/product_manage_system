import axiosClient from "./axiosClient";

export const cartApi = {
    getCart: () => {
        return axiosClient.get("/cart/");
    },

    getItems: () => {
        return axiosClient.get("/cart/items/");
    },

    addItem: (data) => {
        return axiosClient.post("/cart/items/", data);
    },

    updateItem: (id, data) => {
        return axiosClient.patch(`/cart/items/${id}/`, data);
    },

    removeItem: (id) => {
        return axiosClient.delete(`/cart/items/${id}/`);
    },

    checkout: (data) => {
        return axiosClient.post("/checkout/", data);
    },
};
