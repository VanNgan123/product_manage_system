import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("accessToken");

    // Nếu không có token -> Đuổi về trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token -> Cho phép đi tiếp vào các trang bên trong
    return <Outlet />;
    <Route element={<ProtectedRoute />}>

        <Route
            path="/"
            element={<Navigate to="/products" replace />}
        />

        <Route
            path="/products"
            element={<ProductListPage />}
        />

        <Route
            path="/products/:id"
            element={<ProductDetailPage />}
        />

        <Route
            path="/cart"
            element={<CartPage />}
        />

        <Route
            path="/checkout"
            element={<CheckoutPage />}
        />

    </Route>
}

export default ProtectedRoute;
