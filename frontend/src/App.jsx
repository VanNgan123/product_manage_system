import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./index.css";

import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// User Pages
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrderDetailPage from "./pages/orders/MyOrderDetailPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ProductListPage from "./pages/products/ProductListPage";

// Admin Pages
import AdminHomePage from "./pages/admin/product/AdminHomePage";
import CategoryFormPage from "./pages/categories/CategoryFormPage";
import CategoryListPage from "./pages/categories/CategoryListPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import OrderListPage from "./pages/orders/OrderListPage";
import ProductFormPage from "./pages/products/ProductFormPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC ROUTES */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/"
                        element={<Navigate to="/products" replace />}
                    />

                    {/* USER */}
                    <Route
                        path="/products"
                        element={<ProductListPage />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetailPage />}
                    />

                    <Route
                        path="/checkout"
                        element={<CheckoutPage />}
                    />

                    <Route
                        path="/my-orders"
                        element={<MyOrdersPage />}
                    />

                    <Route
                        path="/my-orders/:id"
                        element={<MyOrderDetailPage />}
                    />

                    {/* ADMIN */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Layout />
                            </AdminRoute>
                        }
                    >
                        <Route
                            index
                            element={<AdminHomePage />}
                        />

                        {/* Category */}
                        <Route
                            path="categories"
                            element={<CategoryListPage />}
                        />

                        <Route
                            path="categories/create"
                            element={<CategoryFormPage />}
                        />

                        <Route
                            path="categories/:id/edit"
                            element={<CategoryFormPage />}
                        />

                        {/* Product */}
                        <Route
                            path="products/create"
                            element={<ProductFormPage />}
                        />

                        <Route
                            path="products/:id/edit"
                            element={<ProductFormPage />}
                        />

                        {/* Orders */}
                        <Route
                            path="orders"
                            element={<OrderListPage />}
                        />

                        <Route
                            path="orders/:id"
                            element={<OrderDetailPage />}
                        />
                    </Route>
                </Route>

                {/* FALLBACK */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
