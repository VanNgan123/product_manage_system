import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import "../styles/RegisterPage.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            password: "",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Register data:", formData);

            const response = await authApi.register(formData);

            console.log("Register success:", response);

            alert("Đăng ký thành công");

            navigate("/login");
        } catch (error) {
            console.error("Register error:", error);

            console.log("Response:", error.response);

            alert(
                error.response?.data?.message ||
                JSON.stringify(error.response?.data) ||
                "Đăng ký thất bại"
            );
        }
    };

    return (
        <div className="register-page">
            <div className="background-orb orb-1"></div>
            <div className="background-orb orb-2"></div>
            <div className="background-orb orb-3"></div>

            <div className="register-card">
                <div className="logo">
                    PMS
                </div>

                <h3>
                    Create Account
                </h3>

                <p className="subtitle">
                    Register new account
                </p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                username: e.target.value,
                            })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                first_name: e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                last_name: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="login-link">
                    <span>Đã có tài khoản?</span>

                    <Link to="/login">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
