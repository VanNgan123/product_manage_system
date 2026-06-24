
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import "../styles/LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const [role, setRole] = useState("user");
    const [switching, setSwitching] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const changeRole = (newRole) => {
        if (newRole === role) return;

        setSwitching(true);

        setTimeout(() => {
            setRole(newRole);
            setSwitching(false);
        }, 700);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await authApi.login(formData);

            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);

            const meResponse = await authApi.me();

            // Lấy dữ liệu user
            const userData = meResponse.data.data ? meResponse.data.data : meResponse.data;

            localStorage.setItem("user", JSON.stringify(userData));

            // ==========================================
            // BƯỚC QUAN TRỌNG NHẤT: IN RA ĐỂ KIỂM TRA
            console.log("DỮ LIỆU TÀI KHOẢN TỪ BACKEND TRẢ VỀ LÀ:", userData);
            // ==========================================

            // KIỂM TRA QUYỀN: Tạm thời thêm is_staff và is_superuser vào để quét mọi trường hợp
            if (userData.role === "admin" || userData.is_staff === true || userData.is_superuser === true) {
                navigate("/admin");
            } else {
                navigate("/products");
            }

        } catch (err) {
            console.error(err);
            setError("Đăng nhập thất bại. Kiểm tra lại tài khoản hoặc mật khẩu.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={`login-page ${role} ${switching ? "switching" : ""}`}>
            <div className="background-orb orb-1"></div>
            <div className="background-orb orb-2"></div>
            <div className="background-orb orb-3"></div>

            <div className="login-card">

                <div className="logo">
                    PMS
                </div>

                <h1>
                    Product Management System
                </h1>

                <p className="subtitle">
                    {role === "admin"
                        ? "Administrator Access"
                        : "Customer Portal"}
                </p>

                <div className="role-switch">
                    <button
                        type="button"
                        className={
                            role === "user"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            changeRole("user")
                        }
                    >
                        User
                    </button>

                    <button
                        type="button"
                        className={
                            role === "admin"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            changeRole("admin")
                        }
                    >
                        Admin
                    </button>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading
                            ? "Đang đăng nhập..."
                            : role === "admin"
                                ? "Đăng nhập Admin"
                                : "Đăng nhập User"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
