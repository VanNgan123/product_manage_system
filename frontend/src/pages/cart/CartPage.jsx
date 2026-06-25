import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../../api/cartApi";

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await cartApi.getCart();
            setCart(response.data.data);
        } catch {
            setError("Không thể tải giỏ hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchCart, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleUpdateQuantity = async (item, newQty) => {
        if (newQty < 1) return;
        try {
            setError("");
            await cartApi.updateItem(item.id, { quantity: newQty });
            fetchCart();
        } catch (error) {
            setError(error.response?.data?.message || "Cập nhật số lượng thất bại.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await cartApi.removeItem(itemId);
            fetchCart();
        } catch {
            setError("Xóa sản phẩm khỏi giỏ hàng thất bại.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const items = cart?.items || [];
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return (
            <div className="cart-wrapper">
                <div className="loading-card">Đang tải giỏ hàng...</div>
            </div>
        );
    }

    return (
        <div className="cart-wrapper">
            <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>
            <p className="cart-subtitle">
                {items.length > 0
                    ? `Bạn có ${itemCount} sản phẩm trong giỏ hàng`
                    : "Giỏ hàng đang trống"}
            </p>
 
            {error && <div className="error-alert" style={{ marginBottom: "20px" }}>{error}</div>}

            {items.length === 0 ? (
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <h3>Giỏ hàng trống</h3>
                    <p>Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!</p>
                    <Link to="/products" className="hero-btn-primary" style={{ display: "inline-flex" }}>
                        🛍️ Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img
                                    className="cart-item-img"
                                    src={item.product_detail?.image_url || "https://placehold.co/110x110/e2e8f0/94a3b8?text=IMG"}
                                    alt={item.product_detail?.name}
                                />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.product_detail?.name}</div>
                                    <div className="cart-item-price">
                                        {formatPrice(item.product_detail?.price)}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="cart-qty-controls">
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                style={{
                                                    opacity: item.quantity <= 1 ? 0.5 : 1,
                                                    cursor: item.quantity <= 1 ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                −
                                            </button>
                                            <span className="cart-qty-value">{item.quantity}</span>
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                disabled={item.quantity >= (item.product_detail?.quantity || 0)}
                                                style={{
                                                    opacity: item.quantity >= (item.product_detail?.quantity || 0) ? 0.5 : 1,
                                                    cursor: item.quantity >= (item.product_detail?.quantity || 0) ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="cart-item-total">
                                            {formatPrice(item.total_price)}
                                        </span>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className="cart-summary-row">
                            <span>Tạm tính ({itemCount} sản phẩm)</span>
                            <strong>{formatPrice(cart.total_amount)}</strong>
                        </div>
                        <div className="cart-summary-row">
                            <span>Phí vận chuyển</span>
                            <strong style={{ color: "var(--success)" }}>Miễn phí</strong>
                        </div>
                        <div className="cart-summary-total">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(cart.total_amount)}</span>
                        </div>
                        <button
                            className="cart-checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            Tiến hành thanh toán →
                        </button>
                        <Link to="/products" className="cart-continue">
                            ← Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
