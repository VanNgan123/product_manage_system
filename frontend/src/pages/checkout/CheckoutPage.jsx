import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cartApi } from "../../api/cartApi";

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [formData, setFormData] = useState({ full_name: "", phone: "", address: "", note: "" });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await cartApi.getCart();
                setCart(response.data.data);
            } catch {
                setError("Không thể kiểm tra thông tin giỏ hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            await cartApi.checkout(formData);
            navigate("/my-orders");
        } catch (error) {
            setError(error.response?.data?.message || "Checkout thất bại. Vui lòng kiểm tra lại giỏ hàng.");
        } finally {
            setSubmitting(false);
        }
    };

    const items = cart?.items || [];

    if (loading) return <div className="loading-card" style={{ margin: "40px auto", maxWidth: "600px" }}>Đang tải dữ liệu thanh toán...</div>;

    return (
        <div className="checkout-wrapper">
            <h1 className="checkout-title">Thanh toán đơn hàng</h1>

            {error && <div className="error-alert" style={{ marginBottom: "24px" }}>{error}</div>}

            {items.length === 0 ? (
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <h3>Giỏ hàng đang trống</h3>
                    <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                    <Link to="/products" className="hero-btn-primary" style={{ display: "inline-flex" }}>
                        Quay lại mua sắm
                    </Link>
                </div>
            ) : (
                <div className="checkout-layout">
                    <div className="checkout-form-card">
                        <h2>Thông tin giao nhận hàng</h2>
                        <form className="checkout-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-secondary)" }}>
                                    Họ tên người nhận
                                </label>
                                <input
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Nhập đầy đủ họ và tên"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-secondary)" }}>
                                    Số điện thoại
                                </label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại liên hệ"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-secondary)" }}>
                                    Địa chỉ giao hàng
                                </label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Địa chỉ nhận hàng chi tiết"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-secondary)" }}>
                                    Ghi chú (tùy chọn)
                                </label>
                                <textarea
                                    name="note"
                                    rows="2"
                                    value={formData.note}
                                    onChange={handleChange}
                                    placeholder="Ghi chú thêm cho shipper hoặc cửa hàng"
                                />
                            </div>
                            <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                                {submitting ? "Đang xử lý đặt hàng..." : "Xác nhận đặt hàng"}
                            </button>
                        </form>
                    </div>

                    <div className="checkout-summary-card">
                        <h2>Tóm tắt đơn hàng</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                            {items.map((item) => (
                                <div className="checkout-item" key={item.id}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <span className="checkout-item-name" style={{ fontWeight: "500" }}>
                                            {item.product_detail?.name}
                                        </span>
                                        <span className="checkout-item-qty" style={{ fontSize: "12px" }}>
                                            Số lượng: {item.quantity}
                                        </span>
                                    </div>
                                    <strong className="checkout-item-price">{formatPrice(item.total_price)}</strong>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingTop: "16px",
                                borderTop: "2px dashed var(--border-color)",
                                marginTop: "16px",
                            }}
                        >
                            <span style={{ fontWeight: "600", fontSize: "16px" }}>Tổng thanh toán</span>
                            <strong style={{ fontSize: "20px", color: "var(--accent)", fontWeight: "800" }}>
                                {formatPrice(cart.total_amount)}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";

function CheckoutPage() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        address: "",
        note: "",
    });

    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);

            const response = await cartApi.getCart();

            setCart(response.data.data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setCheckoutLoading(true);
            setError("");

            await cartApi.checkout({
                full_name: formData.full_name,
                phone: formData.phone,
                address: formData.address,
                note: formData.note,
            });

            alert("Đặt hàng thành công");

            navigate("/my-orders");
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Checkout thất bại. Vui lòng thử lại."
            );
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return <h3>Đang tải...</h3>;
    }

    if (error && !cart) {
        return <h3>{error}</h3>;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mt-4">
                <h3>Giỏ hàng đang trống</h3>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Checkout</h2>

            <div className="card p-3 mb-4">
                <h5>Tóm tắt đơn hàng</h5>

                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="d-flex justify-content-between border-bottom py-2"
                    >
                        <span>
                            {item.product_name} x {item.quantity}
                        </span>

                        <span>
                            {Number(item.total_price).toLocaleString()} VNĐ
                        </span>
                    </div>
                ))}

                <h4 className="mt-3">
                    Tổng tiền:
                    {" "}
                    {Number(cart.total_amount).toLocaleString()} VNĐ
                </h4>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">
                        Họ và tên
                    </label>

                    <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Số điện thoại
                    </label>

                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Địa chỉ giao hàng
                    </label>

                    <textarea
                        name="address"
                        className="form-control"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Ghi chú
                    </label>

                    <textarea
                        name="note"
                        className="form-control"
                        rows="3"
                        value={formData.note}
                        onChange={handleChange}
                    />
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={checkoutLoading}
                >
                    {checkoutLoading
                        ? "Đang xử lý..."
                        : "Đặt hàng"}
                </button>
            </form>

        </div>
    );
}


export default CheckoutPage;
  

