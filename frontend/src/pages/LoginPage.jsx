import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await authApi.login(formData);

            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);

            navigate("/products");
        } catch (error) {
            setError("Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Đăng nhập</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
