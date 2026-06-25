import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import "../../styles/cart.css";

function CartPage() {
    const navigate = useNavigate();


    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

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

    const handleQuantityChange = async (
        itemId,
        quantity
    ) => {
        if (quantity < 1) return;

        try {
            await cartApi.updateItem(itemId, {
                quantity: Number(quantity),
            });

            fetchCart();
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật số lượng");
        }
    };

    const handleRemove = async (itemId) => {
        const confirmed = window.confirm(
            "Xóa sản phẩm khỏi giỏ?"
        );

        if (!confirmed) return;

        try {
            await cartApi.removeItem(itemId);

            fetchCart();
        } catch (err) {
            console.error(err);
            alert("Không thể xóa sản phẩm");
        }
    };

    if (loading) {
        return (
            <div className="container py-4">
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    if (!cart || cart.items?.length === 0) {
        return (
            <div className="container py-4">
                <h2>Giỏ hàng</h2>

                <div className="alert alert-info mt-3">
                    Giỏ hàng đang trống
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>🛒 Giỏ hàng của bạn</h1>
                    <span>{cart.items.length} sản phẩm</span>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="cart-item-card"
                            >
                                <div className="cart-image">
                                    <img
                                        src={
                                            item.product?.image_url ||
                                            "https://placehold.co/200x200"
                                        }
                                        alt={item.product?.name}
                                    />
                                </div>

                                <div className="cart-info">
                                    <h3>
                                        {item.product?.name}
                                    </h3>

                                    <div className="cart-price">
                                        {Number(
                                            item.price
                                        ).toLocaleString()}
                                        đ
                                    </div>
                                </div>

                                <div className="cart-quantity">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-total">
                                    {Number(
                                        item.total_amount
                                    ).toLocaleString()}
                                    đ
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        handleRemove(item.id)
                                    }
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-card">
                        <h3>Tóm tắt đơn hàng</h3>

                        <div className="summary-row">
                            <span>Số sản phẩm</span>
                            <strong>
                                {cart.items.length}
                            </strong>
                        </div>

                        <div className="summary-row total">
                            <span>Tổng cộng</span>
                            <strong>
                                {Number(
                                    cart.total_amount
                                ).toLocaleString()}
                                đ
                            </strong>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CartPage;
