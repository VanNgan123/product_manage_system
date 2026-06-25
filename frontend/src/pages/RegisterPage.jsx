import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    });
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
            await authApi.register(formData);
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card wide">
                <div className="auth-header">
                    <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span style={{ background: "var(--accent)", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800" }}>R</span>
                        Rainscales<span style={{ color: "var(--accent)" }}>Shop</span>
                    </h1>
                    <p>Tạo tài khoản khách hàng mới</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>First name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Last name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>

                        <div className="form-group full-width">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" className="btn-primary block" disabled={loading}>
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                <p className="auth-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
