import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("accessToken");

    // Nếu không có token -> Đuổi về trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token -> Cho phép đi tiếp vào các trang bên trong
    return <Outlet />;
}

export default ProtectedRoute;
