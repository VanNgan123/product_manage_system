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

    // return (
    //     <div className="container vh-100 d-flex justify-content-center align-items-center">
    //         <div
    //             className="card shadow-lg p-4"
    //             style={{
    //                 width: "420px",
    //                 borderRadius: "16px",
    //             }}
    //         >
    //             <h2 className="text-center mb-4">
    //                 Product Management
    //             </h2>

    //             <form onSubmit={handleSubmit}>
    //                 <div className="mb-3">
    //                     <label className="form-label">
    //                         Username
    //                     </label>

    //                     <input
    //                         className="form-control"
    //                         name="username"
    //                         value={formData.username}
    //                         onChange={handleChange}
    //                         placeholder="Nhập username"
    //                     />
    //                 </div>

    //                 <div className="mb-3">
    //                     <label className="form-label">
    //                         Password
    //                     </label>

    //                     <input
    //                         className="form-control"
    //                         name="password"
    //                         type="password"
    //                         value={formData.password}
    //                         onChange={handleChange}
    //                         placeholder="Nhập password"
    //                     />
    //                 </div>

    //                 {error && (
    //                     <div className="alert alert-danger">
    //                         {error}
    //                     </div>
    //                 )}

    //                 <button
    //                     type="submit"
    //                     disabled={loading}
    //                     className="btn btn-primary w-100"
    //                 >
    //                     {loading
    //                         ? "Đang đăng nhập..."
    //                         : "Đăng nhập"}
    //                 </button>
    //             </form>
    //         </div>
    //     </div>
    // );

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>PMS</h1>
                    <p>Product Management System</p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập password"
                        />
                    </div>

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
                            : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
