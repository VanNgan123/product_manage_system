import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const loginResponse = await authApi.login(formData);
            localStorage.setItem("accessToken", loginResponse.data.access);
            localStorage.setItem("refreshToken", loginResponse.data.refresh);

            const meResponse = await authApi.me();
            const user = meResponse.data.data;
            localStorage.setItem("user", JSON.stringify(user));

            navigate(user.is_staff ? "/admin/products" : "/products");
        } catch {
            setError("Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span style={{ background: "var(--accent)", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800" }}>R</span>
                        Rainscales<span style={{ color: "var(--accent)" }}>Shop</span>
                    </h1>
                    <p>Cửa hàng dụng cụ Pickleball chính hãng</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập password"
                            required
                        />
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" className="btn-primary block" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="auth-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
