import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderApi } from "../../api/orderApi";

function OrderDetailPage() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const response =
                await orderApi.getById(id);

            setOrder(response.data.data);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        e
    ) => {
        const status = e.target.value;

        await orderApi.updateStatus(id, {
            status,
        });

        fetchOrder();
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;

    if (!order) return <p>Không tìm thấy</p>;

    return (
        <div>
            <h2>Đơn hàng #{order.id}</h2>

            <p>
                Người nhận:
                {order.full_name}
            </p>

            <p>
                Điện thoại:
                {order.phone}
            </p>

            <p>
                Địa chỉ:
                {order.address}
            </p>

            <p>
                Tổng tiền:
                {order.total_amount}
            </p>

            <select
                value={order.status}
                onChange={
                    handleStatusChange
                }
            >
                <option value="pending">
                    pending
                </option>

                <option value="confirmed">
                    confirmed
                </option>

                <option value="shipping">
                    shipping
                </option>

                <option value="completed">
                    completed
                </option>

                <option value="cancelled">
                    cancelled
                </option>
            </select>

            <hr />

            <h3>Sản phẩm</h3>

            {order.items?.map((item) => (
                <div key={item.id}>
                    {item.product_name} x{" "}
                    {item.quantity}
                </div>
            ))}
        </div>
    );
}

export default OrderDetailPage;
