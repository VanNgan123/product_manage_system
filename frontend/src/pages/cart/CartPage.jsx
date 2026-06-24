import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";

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
        <div className="container py-4">
            <h2 className="mb-4">
                Giỏ hàng
            </h2>

            <table className="table table-bordered align-middle">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.id}>
                            <td width="120">
                                <img
                                    src={
                                        item.product?.image_url
                                    }
                                    alt={
                                        item.product?.name
                                    }
                                    className="img-fluid rounded"
                                />
                            </td>

                            <td>
                                {
                                    item.product?.name
                                }
                            </td>

                            <td>
                                {Number(
                                    item.price
                                ).toLocaleString()}
                                đ
                            </td>

                            <td width="140">
                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        item.quantity
                                    }
                                    className="form-control"
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                />
                            </td>

                            <td>
                                {Number(
                                    item.total_amount
                                ).toLocaleString()}
                                đ
                            </td>

                            <td width="120">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        handleRemove(
                                            item.id
                                        )
                                    }
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <h4>
                    Tổng tiền:{" "}
                    {Number(
                        cart.total_amount
                    ).toLocaleString()}
                    đ
                </h4>

                <button
                    className="btn btn-success"
                    onClick={() =>
                        navigate("/checkout")
                    }
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );


}

export default CartPage;
