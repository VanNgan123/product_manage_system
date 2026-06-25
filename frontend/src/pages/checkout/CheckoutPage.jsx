import { useEffect, useState } from "react";
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
