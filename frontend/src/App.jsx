import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import LoginPage from "./pages/LoginPage";

// --- Trang User ---
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrderDetailPage from "./pages/orders/MyOrderDetailPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ProductListPage from "./pages/products/ProductListPage";

// --- Trang Admin ---
import AdminHomePage from "./pages/admin/product/AdminHomePage";
import CategoryFormPage from "./pages/categories/CategoryFormPage";
import CategoryListPage from "./pages/categories/CategoryListPage";
import ProductFormPage from "./pages/products/ProductFormPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROUTE PUBLIC */}
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    {/* === NHÓM USER (Không có Sidebar) === */}
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                    <Route path="/my-orders/:id" element={<MyOrderDetailPage />} />

                    {/* === NHÓM ADMIN (CÓ SIDEBAR) === */}
                    {/* BÍ QUYẾT LÀ ĐÂY: Thẻ Layout được bọc bên ngoài toàn bộ các trang Admin */}
                    <Route path="/admin" element={<Layout />}>

                        {/* Nhờ nằm trong Layout, AdminHomePage giờ sẽ có Sidebar */}
                        <Route index element={<AdminHomePage />} />

                        <Route path="categories" element={<CategoryListPage />} />
                        <Route path="categories/create" element={<CategoryFormPage />} />
                        <Route path="categories/:id/edit" element={<CategoryFormPage />} />

                        <Route path="products/create" element={<ProductFormPage />} />
                        <Route path="products/:id/edit" element={<ProductFormPage />} />

                        {/* Sau này bạn làm trang Orders thì bỏ comment dòng dưới nhé */}
                        {/* <Route path="orders" element={<OrderListPage />} /> */}
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
