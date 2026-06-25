import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/Layout";
import CustomerLayout from "./components/CustomerLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminProductFormPage from "./pages/admin/products/AdminProductFormPage";
import AdminProductListPage from "./pages/admin/products/AdminProductListPage";
import CartPage from "./pages/cart/CartPage";
import CategoryFormPage from "./pages/categories/CategoryFormPage";
import CategoryListPage from "./pages/categories/CategoryListPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrderDetailPage from "./pages/orders/MyOrderDetailPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import OrderListPage from "./pages/orders/OrderListPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ProductListPage from "./pages/products/ProductListPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Customer routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <CustomerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/:id" element={<ProductDetailPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="my-orders" element={<MyOrdersPage />} />
                    <Route path="my-orders/:id" element={<MyOrderDetailPage />} />
                </Route>

                {/* Admin routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                >
                    <Route path="admin/products" element={<AdminProductListPage />} />
                    <Route path="admin/products/create" element={<AdminProductFormPage />} />
                    <Route path="admin/products/:id/edit" element={<AdminProductFormPage />} />
                    <Route path="admin/categories" element={<CategoryListPage />} />
                    <Route path="admin/categories/create" element={<CategoryFormPage />} />
                    <Route path="admin/categories/:id/edit" element={<CategoryFormPage />} />
                    <Route path="admin/orders" element={<OrderListPage />} />
                    <Route path="admin/orders/:id" element={<OrderDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

