import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user.is_staff) {
        return <Navigate to="/products" replace />;
    }

    return children;
}

export default AdminRoute;
